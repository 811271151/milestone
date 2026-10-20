import type { DraftInput, Preferences, Project, Transaction, Workspace } from './models.ts'
import { CLIENT_ADDRESS, NETWORK } from './models.ts'
import { fromUnits, sumAmounts, toUnits } from './money.ts'

export function totals(project: Project) {
  const total = sumAmounts(project.milestones.map((m) => m.amount))
  const released = sumAmounts(
    project.milestones.filter((m) => m.status === 'released').map((m) => m.amount),
  )
  const funded = project.status === 'active' || project.status === 'completed'
  return {
    total,
    released,
    remaining: funded ? fromUnits(toUnits(total) - toUnits(released)) : '0',
  }
}
export function currentMilestone(project: Project) {
  return project.milestones.find((m) => m.status !== 'released')
}

export function validateDraft(input: DraftInput) {
  if (!input.title.trim() || !input.client.trim() || !input.description.trim())
    throw new Error('requiredFields')
  if (
    !/^0x[\da-fA-F]{40}$/.test(input.contractorAddress) ||
    input.contractorAddress.toLowerCase() === CLIENT_ADDRESS.toLowerCase()
  )
    throw new Error('invalidAddress')
  if (input.milestones.length < 1 || input.milestones.length > 5) throw new Error('milestoneLimit')
  if (toUnits(input.totalAmount) <= 0n) throw new Error('invalidAmount')
  for (const m of input.milestones) {
    if (
      !m.title.trim() ||
      !m.description.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(m.dueDate) ||
      Number.isNaN(Date.parse(m.dueDate)) ||
      new Date(m.dueDate).toISOString().slice(0, 10) !== m.dueDate
    )
      throw new Error('requiredFields')
    if (toUnits(m.amount) <= 0n) throw new Error('invalidAmount')
  }
  if (toUnits(sumAmounts(input.milestones.map((m) => m.amount))) !== toUnits(input.totalAmount))
    throw new Error('amountMismatch')
  if (
    input.milestones.some(
      (m, index) => index > 0 && m.dueDate < input.milestones[index - 1].dueDate,
    )
  )
    throw new Error('dateOrder')
}
export function makeDraft(input: DraftInput): Project {
  validateDraft(input)
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    client: input.client.trim(),
    description: input.description.trim(),
    clientAddress: CLIENT_ADDRESS,
    contractorAddress: input.contractorAddress,
    network: NETWORK,
    status: 'draft',
    createdAt: new Date().toISOString(),
    milestones: input.milestones.map((m) => ({
      ...m,
      id: crypto.randomUUID(),
      status: 'pending',
      submissions: [],
    })),
  }
}
export function assertOperation(
  project: Project,
  transaction: Pick<Transaction, 'type' | 'milestoneId'>,
  preferences: Preferences,
) {
  if (!preferences.connected) throw new Error('connectFirst')
  if (preferences.role !== 'client') throw new Error('clientOnly')
  if (transaction.type === 'fund') {
    if (project.status !== 'draft' && project.status !== 'awaiting_funding')
      throw new Error('invalidState')
  } else {
    const milestone = currentMilestone(project)
    if (
      project.status !== 'active' ||
      !milestone ||
      milestone.id !== transaction.milestoneId ||
      milestone.status !== 'submitted'
    )
      throw new Error('invalidState')
  }
}
/** Only confirmed gateway results may mutate funded/released state. */
export function applyConfirmation(workspace: Workspace, transaction: Transaction): Workspace {
  if (transaction.status !== 'confirmed') return workspace
  return {
    ...workspace,
    projects: workspace.projects.map((p) => {
      if (p.id !== transaction.projectId) return p
      if (transaction.type === 'fund') {
        if (
          !['draft', 'awaiting_funding'].includes(p.status) ||
          toUnits(transaction.amount) !== toUnits(totals(p).total)
        )
          return p
        return {
          ...p,
          status: 'active',
          milestones: p.milestones.map((m, i) => ({
            ...m,
            status: i === 0 ? 'available' : 'pending',
          })),
        }
      }
      const current = currentMilestone(p)
      if (
        !current ||
        current.id !== transaction.milestoneId ||
        current.status !== 'submitted' ||
        toUnits(transaction.amount) !== toUnits(current.amount)
      )
        return p
      const index = p.milestones.findIndex((m) => m.id === current.id)
      const milestones = p.milestones.map((m, i) => ({
        ...m,
        status:
          i === index ? ('released' as const) : i === index + 1 ? ('available' as const) : m.status,
      }))
      return {
        ...p,
        milestones,
        status: milestones.every((m) => m.status === 'released') ? 'completed' : 'active',
      }
    }),
  }
}
export function submitDelivery(
  project: Project,
  milestoneId: string,
  summary: string,
  url: string,
  preferences: Preferences,
): Project {
  if (!preferences.connected) throw new Error('connectFirst')
  if (preferences.role !== 'contractor') throw new Error('contractorOnly')
  if (
    project.status !== 'active' ||
    currentMilestone(project)?.id !== milestoneId ||
    currentMilestone(project)?.status !== 'available'
  )
    throw new Error('invalidState')
  if (!summary.trim()) throw new Error('requiredFields')
  if (url && !isSafeUrl(url)) throw new Error('invalidUrl')
  return {
    ...project,
    milestones: project.milestones.map((m) =>
      m.id !== milestoneId
        ? m
        : {
            ...m,
            status: 'submitted',
            submissions: [
              ...m.submissions,
              {
                id: crypto.randomUUID(),
                summary: summary.trim(),
                ...(url ? { url } : {}),
                submittedAt: new Date().toISOString(),
              },
            ],
          },
    ),
  }
}
export function isSafeUrl(value: string) {
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}
