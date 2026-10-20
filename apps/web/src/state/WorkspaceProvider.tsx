import { useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Transaction, Workspace } from '../domain/models'
import {
  applyConfirmation,
  assertOperation,
  currentMilestone,
  makeDraft,
  submitDelivery,
  totals,
} from '../domain/workflow'
import { demoEscrowGateway } from '../services/escrowGateway'
import { loadPreferences, loadWorkspace, persist } from '../services/storage'
import { WorkspaceContext } from './context'
import type { ContextValue } from './context'
export function WorkspaceProvider({ children }: PropsWithChildren) {
  const [loaded] = useState(loadWorkspace)
  const [workspace, setWorkspace] = useState(loaded.workspace)
  const [preferences, updatePreferences] = useState(loadPreferences)
  const [storageWarning, setStorageWarning] = useState(loaded.recovered)
  const [busy, setBusy] = useState(false)
  const current = useRef(workspace)
  const currentPreferences = useRef(preferences)
  const locked = useRef(false)
  const commit = (update: (value: Workspace) => Workspace) => {
    const next = update(current.current)
    current.current = next
    setWorkspace(next)
    if (!persist(next, currentPreferences.current)) setStorageWarning(true)
  }

  const saveDraft: ContextValue['saveDraft'] = (input, id) => {
    if (!preferences.connected) throw new Error('connectFirst')
    if (preferences.role !== 'client') throw new Error('clientOnly')
    const draft = makeDraft(input)
    if (id) {
      const original = current.current.projects.find((p) => p.id === id)
      if (!original || original.status !== 'draft' || locked.current)
        throw new Error('invalidState')
      commit((s) => ({
        ...s,
        projects: s.projects.map((p) =>
          p.id === id ? { ...draft, id, createdAt: p.createdAt } : p,
        ),
      }))
      return id
    }
    commit((s) => ({ ...s, projects: [draft, ...s.projects] }))
    return draft.id
  }
  const execute: ContextValue['execute'] = async (projectId, type, fail) => {
    if (locked.current) throw new Error('operationBusy')
    const project = current.current.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('invalidState')
    const milestone = currentMilestone(project)
    if (type === 'release' && !milestone) throw new Error('invalidState')
    const tx: Transaction = {
      id: crypto.randomUUID(),
      projectId,
      type,
      ...(type === 'release' ? { milestoneId: milestone?.id } : {}),
      amount: type === 'fund' ? totals(project).total : milestone!.amount,
      recipient: type === 'fund' ? 'Demo Escrow' : project.contractorAddress,
      createdAt: new Date().toISOString(),
      status: 'signing',
    }
    assertOperation(project, tx, preferences)
    locked.current = true
    setBusy(true)
    commit((s) => ({
      ...s,
      transactions: [tx, ...s.transactions],
      projects: s.projects.map((p) =>
        p.id === projectId && type === 'fund' ? { ...p, status: 'awaiting_funding' } : p,
      ),
    }))
    try {
      await demoEscrowGateway.execute(
        tx,
        (status) => {
          const result = { ...tx, status }
          commit((s) =>
            applyConfirmation(
              { ...s, transactions: s.transactions.map((t) => (t.id === tx.id ? result : t)) },
              result,
            ),
          )
        },
        fail,
      )
    } catch (error) {
      commit((s) => ({
        ...s,
        transactions: s.transactions.map((t) =>
          t.id === tx.id
            ? {
                ...t,
                status: 'failed',
                error: error instanceof Error ? error.message : 'demoFailure',
              }
            : t,
        ),
      }))
      throw error
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  const deliver: ContextValue['deliver'] = (projectId, milestoneId, summary, url) => {
    if (locked.current) throw new Error('operationBusy')
    const project = current.current.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('invalidState')
    const updated = submitDelivery(project, milestoneId, summary, url, preferences)
    commit((s) => ({ ...s, projects: s.projects.map((p) => (p.id === projectId ? updated : p)) }))
  }
  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        preferences,
        storageWarning,
        busy,
        setPreferences: (patch) => {
          const next = { ...currentPreferences.current, ...patch }
          currentPreferences.current = next
          updatePreferences(next)
          if (!persist(current.current, next)) setStorageWarning(true)
        },
        saveDraft,
        execute,
        deliver,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}
