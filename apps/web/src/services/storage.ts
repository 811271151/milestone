import type { Preferences, Workspace } from '../domain/models'
import { initialWorkspace } from '../domain/fixtures'
import { toUnits } from '../domain/money'

const dataKey = 'milestone.web.workspace.v1'
const preferencesKey = 'milestone.web.preferences.v1'
export const defaults: Preferences = {
  language: 'zh-CN',
  appearance: 'light',
  accent: 'mint',
  role: 'client',
  connected: true,
}

export function loadPreferences(): Preferences {
  try {
    const p = JSON.parse(localStorage.getItem(preferencesKey) || '{}')
    return {
      language: ['zh-CN', 'en-US'].includes(p.language) ? p.language : defaults.language,
      appearance: ['light', 'dark', 'system'].includes(p.appearance)
        ? p.appearance
        : defaults.appearance,
      accent: ['mint', 'ocean', 'amber', 'violet'].includes(p.accent) ? p.accent : defaults.accent,
      role: ['client', 'contractor'].includes(p.role) ? p.role : defaults.role,
      connected: typeof p.connected === 'boolean' ? p.connected : defaults.connected,
    }
  } catch {
    return defaults
  }
}
export function loadWorkspace(): { workspace: Workspace; recovered: boolean } {
  try {
    const raw = localStorage.getItem(dataKey)
    if (!raw) return { workspace: initialWorkspace(), recovered: false }
    const data = JSON.parse(raw) as Workspace
    if (!Array.isArray(data.projects) || !Array.isArray(data.transactions))
      throw new Error('Invalid workspace')
    for (const p of data.projects) {
      if (
        ![
          p.id,
          p.title,
          p.client,
          p.description,
          p.clientAddress,
          p.contractorAddress,
          p.createdAt,
        ].every((v) => typeof v === 'string') ||
        p.network !== 'Ethereum Sepolia' ||
        !['draft', 'awaiting_funding', 'active', 'completed'].includes(p.status) ||
        !Array.isArray(p.milestones) ||
        !p.milestones.length ||
        p.milestones.length > 5
      )
        throw new Error('Invalid project')
      for (const m of p.milestones) {
        toUnits(m.amount)
        if (
          ![m.id, m.title, m.description, m.dueDate].every((v) => typeof v === 'string') ||
          Number.isNaN(Date.parse(m.dueDate)) ||
          !['pending', 'available', 'submitted', 'released'].includes(m.status) ||
          !Array.isArray(m.submissions)
        )
          throw new Error('Invalid milestone')
        for (const submission of m.submissions) {
          if (
            ![submission.id, submission.summary, submission.submittedAt].every(
              (v) => typeof v === 'string',
            ) ||
            Number.isNaN(Date.parse(submission.submittedAt)) ||
            (submission.url !== undefined && typeof submission.url !== 'string')
          )
            throw new Error('Invalid submission')
        }
      }
    }
    // A browser refresh interrupts the local simulator; never infer success.
    data.transactions = data.transactions.map((tx) => {
      toUnits(tx.amount)
      if (
        ![tx.id, tx.projectId, tx.recipient, tx.createdAt].every((v) => typeof v === 'string') ||
        Number.isNaN(Date.parse(tx.createdAt)) ||
        !['fund', 'release'].includes(tx.type) ||
        !['signing', 'pending', 'confirmed', 'failed'].includes(tx.status)
      )
        throw new Error('Invalid transaction')
      return ['signing', 'pending'].includes(tx.status)
        ? { ...tx, status: 'failed' as const, error: 'interrupted' }
        : tx
    })
    return { workspace: data, recovered: false }
  } catch {
    return { workspace: initialWorkspace(), recovered: true }
  }
}
export function persist(workspace: Workspace, preferences: Preferences): boolean {
  try {
    localStorage.setItem(dataKey, JSON.stringify(workspace))
    localStorage.setItem(preferencesKey, JSON.stringify(preferences))
    return true
  } catch {
    return false
  }
}
