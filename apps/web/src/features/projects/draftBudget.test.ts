import { expect, it } from 'vitest'
import { draftBudget } from './draftBudget'

it('checks allocation at USDC precision without rounding large values', () => {
  expect(draftBudget('100000000000.000001', ['100000000000', '0.000001']).status).toBe('balanced')
  expect(draftBudget('100.000001', ['100']).difference).toBe('0.000001')
  expect(draftBudget('100', ['100.000001'])).toMatchObject({
    status: 'over',
    difference: '0.000001',
  })
})

it('keeps empty, invalid, and zero stages distinct from a balanced budget', () => {
  expect(draftBudget('', ['']).status).toBe('incomplete')
  expect(draftBudget('100', ['100', '']).status).toBe('incomplete')
  expect(draftBudget('100', ['100', '0']).status).toBe('incomplete')
  expect(draftBudget('100', ['invalid']).allocated).toBeNull()
  expect(draftBudget('NaN', ['100']).status).toBe('invalid')
  expect(draftBudget('0', ['0']).status).toBe('invalid')
})
