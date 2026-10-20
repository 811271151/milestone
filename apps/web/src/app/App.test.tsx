import { expect, it } from 'vitest'
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { CONTRACTOR_ADDRESS } from '../domain/models'

it('uses desktop navigation and makes project search and pending navigation work', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(await screen.findByRole('heading', { name: '项目工作台' })).toBeInTheDocument()
  expect(screen.getByRole('navigation')).toHaveTextContent('项目总览')
  await user.type(screen.getByRole('textbox', { name: '搜索项目或合作方' }), 'not-a-project')
  expect(screen.getByRole('heading', { name: '没有符合条件的项目' })).toBeInTheDocument()
  await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: /待处理/ }))
  expect(await screen.findByRole('heading', { name: '待处理', level: 1 })).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /审核交付/ })).toHaveLength(2)
})

it('changes the entire interface and persists language, theme, and accent after remount', async () => {
  window.history.replaceState({}, '', '/settings')
  const user = userEvent.setup()
  const app = render(<App />)
  await user.click(await screen.findByRole('button', { name: /English/ }))
  expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Dark' }))
  await user.click(screen.getByRole('button', { name: 'Violet' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(document.documentElement.dataset.accent).toBe('violet')
  app.unmount()
  render(<App />)
  expect(await screen.findByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'Violet' })).toHaveAttribute('aria-pressed', 'true')
})

it('creates a validated draft and opens its detail page', async () => {
  window.history.replaceState({}, '', '/projects/new')
  const user = userEvent.setup()
  render(<App />)
  await user.type(await screen.findByLabelText(/项目名称/), 'Acceptance test project')
  await user.type(screen.getByLabelText(/合作方名称/), 'Acceptance Studio')
  await user.type(screen.getByLabelText(/项目说明/), 'Build and deliver the agreed website.')
  await user.type(screen.getByLabelText(/乙方 EVM 地址/), CONTRACTOR_ADDRESS)
  await user.type(screen.getByLabelText(/项目总额/), '100.25')
  await user.type(screen.getByLabelText(/阶段名称/), 'First delivery')
  await user.type(screen.getByLabelText(/^金额/), '100.25')
  await user.type(screen.getByLabelText(/验收标准/), 'A working preview and handoff notes.')
  fireEvent.change(screen.getByLabelText(/截止日期/), { target: { value: '2026-11-10' } })
  await user.click(screen.getByRole('button', { name: /保存草稿/ }))
  expect(
    await screen.findByRole('heading', { name: 'Acceptance test project', level: 1 }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '模拟托管' })).toBeInTheDocument()
  const saved = JSON.parse(localStorage.getItem('milestone.web.workspace.v1')!)
  expect(saved.projects[0].status).toBe('draft')
  expect(saved.projects[0].milestones[0].amount).toBe('100.25')
})

it('updates the collaboration preview and distinguishes unallocated, excess, and invalid amounts', async () => {
  window.history.replaceState({}, '', '/projects/new')
  const user = userEvent.setup()
  render(<App />)
  const preview = within(await screen.findByRole('complementary', { name: '合作摘要' }))
  await user.type(screen.getByLabelText(/项目名称/), 'Live collaboration')
  expect(preview.getByRole('heading', { name: 'Live collaboration' })).toBeInTheDocument()
  await user.type(screen.getByLabelText(/项目总额/), '100.000001')
  const amount = screen.getByLabelText(/^金额/)
  await user.type(amount, '100')
  expect(preview.getByRole('status')).toHaveTextContent('尚未分配')
  expect(preview.getByRole('status')).toHaveTextContent('0.000001')
  await user.clear(amount)
  await user.type(amount, '101')
  expect(preview.getByRole('status')).toHaveTextContent('超出项目总额')
  await user.clear(amount)
  await user.type(amount, 'invalid')
  expect(preview.getByRole('status')).toHaveTextContent('请检查金额格式与精度')
  await user.clear(amount)
  await user.type(amount, '100.000001')
  expect(preview.getByRole('status')).toHaveTextContent('金额已核对，分配一致')
  expect(preview.getByText('正在完善合作约定')).toBeInTheDocument()
})

it('handles failed release, retry, confirmation, and pending-list updates without double release', async () => {
  window.history.replaceState({}, '', '/projects/atlas-mobile/milestones/atlas-mobile-2')
  const user = userEvent.setup()
  render(<App />)
  await user.click(await screen.findByRole('button', { name: '确认并模拟释放' }))
  let dialog = within(screen.getByRole('dialog'))
  await user.click(dialog.getByRole('checkbox'))
  await user.click(dialog.getByRole('button', { name: '开始模拟交易' }))
  expect(dialog.getByText('关闭', { selector: 'button' })).toBeDisabled()
  expect(
    await dialog.findByText(/操作失败，状态未被错误标记为成功/, {}, { timeout: 4000 }),
  ).toBeInTheDocument()
  await user.click(dialog.getByText('关闭', { selector: 'button' }))
  await user.click(screen.getByRole('button', { name: '确认并模拟释放' }))
  dialog = within(screen.getByRole('dialog'))
  await user.click(dialog.getByRole('button', { name: '开始模拟交易' }))
  expect(
    await dialog.findByText('模拟交易已确认，项目状态已更新。', {}, { timeout: 4000 }),
  ).toBeInTheDocument()
  await user.click(dialog.getByText('关闭', { selector: 'button' }))
  expect(screen.queryByRole('button', { name: '确认并模拟释放' })).not.toBeInTheDocument()
  await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: /待处理/ }))
  await waitFor(() => expect(screen.getAllByRole('link', { name: /审核交付/ })).toHaveLength(1))
  const saved = JSON.parse(localStorage.getItem('milestone.web.workspace.v1')!)
  expect(saved.projects[0].milestones.map((m: { status: string }) => m.status)).toEqual([
    'released',
    'released',
    'available',
    'pending',
  ])
}, 12000)
