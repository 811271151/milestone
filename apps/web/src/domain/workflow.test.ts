import { describe, expect, it } from 'vitest'
import { initialWorkspace } from './fixtures'
import { fromUnits, sumAmounts, toUnits } from './money'
import type { DraftInput, Transaction } from './models'
import { CONTRACTOR_ADDRESS } from './models'
import {
  applyConfirmation,
  assertOperation,
  makeDraft,
  submitDelivery,
  totals,
  validateDraft,
} from './workflow'
import { defaults } from '../services/storage'

const draft: DraftInput = {
  title: 'New product',
  client: 'Studio',
  description: 'Build a product',
  contractorAddress: CONTRACTOR_ADDRESS,
  totalAmount: '0.3',
  milestones: [
    { title: 'Prototype', description: 'Reviewable design', amount: '0.1', dueDate: '2026-10-25' },
    { title: 'Build', description: 'Working build', amount: '0.2', dueDate: '2026-11-25' },
  ],
}
function releaseTx(status: Transaction['status'] = 'confirmed'): Transaction {
  return {
    id: 'release-test',
    projectId: 'atlas-mobile',
    milestoneId: 'atlas-mobile-2',
    type: 'release',
    amount: '1200',
    recipient: CONTRACTOR_ADDRESS,
    status,
    createdAt: new Date().toISOString(),
  }
}
describe('Money and draft invariants', () => {
  it('adds decimal amounts without floating point rounding', () => {
    expect(sumAmounts(['0.1', '0.2'])).toBe('0.300000')
    expect(fromUnits(toUnits('999999999999.999999'))).toBe('999999999999.999999')
  })
  it('rejects precision loss and invalid amounts', () => {
    for (const value of ['1.0000001', '-1', 'NaN', '1e6'])
      expect(() => toUnits(value)).toThrow('invalidAmount')
    expect(() => validateDraft({ ...draft, totalAmount: '0' })).toThrow('invalidAmount')
  })
  it('enforces milestone count, totals, participant address, and ordered valid dates', () => {
    expect(() => validateDraft(draft)).not.toThrow()
    expect(() => validateDraft({ ...draft, totalAmount: '0.4' })).toThrow('amountMismatch')
    expect(() => validateDraft({ ...draft, milestones: [] })).toThrow('milestoneLimit')
    expect(() => validateDraft({ ...draft, contractorAddress: '0x123' })).toThrow('invalidAddress')
    expect(() =>
      validateDraft({ ...draft, milestones: [{ ...draft.milestones[0], dueDate: '2026-02-31' }] }),
    ).toThrow('requiredFields')
    expect(() =>
      validateDraft({ ...draft, milestones: [draft.milestones[1], draft.milestones[0]] }),
    ).toThrow('dateOrder')
  })
})
describe('Escrow and milestone workflow', () => {
  it('requires a connected client and current submitted milestone', () => {
    const project = initialWorkspace().projects[0]
    expect(() => assertOperation(project, releaseTx(), { ...defaults, connected: false })).toThrow(
      'connectFirst',
    )
    expect(() =>
      assertOperation(project, releaseTx(), { ...defaults, role: 'contractor' }),
    ).toThrow('clientOnly')
    expect(() =>
      assertOperation(project, { ...releaseTx(), milestoneId: 'atlas-mobile-3' }, defaults),
    ).toThrow('invalidState')
  })
  it('does not release on pending or failed results', () => {
    const workspace = initialWorkspace()
    expect(applyConfirmation(workspace, releaseTx('pending'))).toEqual(workspace)
    expect(applyConfirmation(workspace, releaseTx('failed'))).toEqual(workspace)
  })
  it('releases once, updates balances, and unlocks exactly the next milestone', () => {
    const workspace = applyConfirmation(initialWorkspace(), releaseTx())
    expect(workspace.projects[0].milestones.map((m) => m.status)).toEqual([
      'released',
      'released',
      'available',
      'pending',
    ])
    expect(totals(workspace.projects[0])).toEqual({
      total: '4800.000000',
      released: '2400.000000',
      remaining: '2400.000000',
    })
    expect(applyConfirmation(workspace, releaseTx())).toEqual(workspace)
  })
  it('ignores a confirmation with an incorrect amount', () => {
    const workspace = initialWorkspace()
    expect(applyConfirmation(workspace, { ...releaseTx(), amount: '100' })).toEqual(workspace)
  })
  it('funds a draft only after confirmation', () => {
    const project = makeDraft(draft)
    const workspace = { projects: [project], transactions: [] }
    const tx: Transaction = { ...releaseTx(), type: 'fund', projectId: project.id, amount: '0.3' }
    expect(applyConfirmation(workspace, { ...tx, status: 'pending' }).projects[0].status).toBe(
      'draft',
    )
    expect(applyConfirmation(workspace, tx).projects[0].milestones.map((m) => m.status)).toEqual([
      'available',
      'pending',
    ])
  })
  it('completes a project only after its final milestone release', () => {
    const project = makeDraft({ ...draft, totalAmount: '0.1', milestones: [draft.milestones[0]] })
    const workspace = {
      projects: [
        {
          ...project,
          status: 'active' as const,
          milestones: project.milestones.map((m) => ({ ...m, status: 'submitted' as const })),
        },
      ],
      transactions: [],
    }
    const tx = {
      ...releaseTx(),
      projectId: project.id,
      milestoneId: project.milestones[0].id,
      amount: '0.1',
    }
    const confirmed = applyConfirmation(workspace, tx)
    expect(confirmed.projects[0].status).toBe('completed')
    expect(totals(confirmed.projects[0]).remaining).toBe('0.000000')
    expect(applyConfirmation(confirmed, tx)).toEqual(confirmed)
  })
  it('requires contractor role and keeps submission history', () => {
    const workspace = applyConfirmation(initialWorkspace(), releaseTx())
    const p = workspace.projects[0]
    expect(() => submitDelivery(p, 'atlas-mobile-3', 'Ready', '', defaults)).toThrow(
      'contractorOnly',
    )
    expect(() =>
      submitDelivery(p, 'atlas-mobile-4', 'Ready', '', { ...defaults, role: 'contractor' }),
    ).toThrow('invalidState')
    expect(() =>
      submitDelivery(p, 'atlas-mobile-3', 'Ready', 'javascript:alert(1)', {
        ...defaults,
        role: 'contractor',
      }),
    ).toThrow('invalidUrl')
    const next = submitDelivery(p, 'atlas-mobile-3', 'Ready', 'https://example.com', {
      ...defaults,
      role: 'contractor',
    })
    expect(next.milestones[2].status).toBe('submitted')
    expect(next.milestones[2].submissions).toHaveLength(1)
    expect(next.milestones[1].submissions).toEqual(p.milestones[1].submissions)
    expect(() =>
      submitDelivery(next, 'atlas-mobile-3', 'Duplicate', '', { ...defaults, role: 'contractor' }),
    ).toThrow('invalidState')
  })
})
