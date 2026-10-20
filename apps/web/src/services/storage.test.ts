import { expect, it } from 'vitest'
import { initialWorkspace } from '../domain/fixtures'
import { defaults, loadPreferences, loadWorkspace, persist } from './storage'

it('restores preferences and local drafts', () => {
  persist(initialWorkspace(), { ...defaults, language: 'en-US', accent: 'violet' })
  expect(loadPreferences().language).toBe('en-US')
  expect(loadWorkspace().workspace.projects).toHaveLength(2)
})
it('recovers corrupted data without crashing', () => {
  localStorage.setItem('milestone.web.workspace.v1', '{broken')
  expect(loadWorkspace().recovered).toBe(true)
})
it('rejects partial record shapes before rendering pages', () => {
  const data = initialWorkspace()
  localStorage.setItem(
    'milestone.web.workspace.v1',
    JSON.stringify({ ...data, projects: [{ ...data.projects[0], client: null }] }),
  )
  expect(loadWorkspace().recovered).toBe(true)
})
it('marks interrupted operations as failed instead of inventing a confirmation', () => {
  const data = initialWorkspace()
  data.transactions[0].status = 'pending'
  persist(data, defaults)
  const tx = loadWorkspace().workspace.transactions[0]
  expect(tx.status).toBe('failed')
  expect(tx.error).toBe('interrupted')
})
