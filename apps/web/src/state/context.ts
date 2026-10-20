import { createContext, useContext } from 'react'
import type { DraftInput, Preferences, TransactionType, Workspace } from '../domain/models'
export interface ContextValue {
  workspace: Workspace
  preferences: Preferences
  storageWarning: boolean
  busy: boolean
  setPreferences: (patch: Partial<Preferences>) => void
  saveDraft: (input: DraftInput, id?: string) => string
  deliver: (projectId: string, milestoneId: string, summary: string, url: string) => void
  execute: (projectId: string, type: TransactionType, fail?: boolean) => Promise<void>
}
export const WorkspaceContext = createContext<ContextValue | null>(null)
export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('WorkspaceProvider missing')
  return value
}
