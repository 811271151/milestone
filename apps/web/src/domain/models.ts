export type Language = 'zh-CN' | 'en-US'
export type Appearance = 'light' | 'dark' | 'system'
export type Accent = 'mint' | 'ocean' | 'amber' | 'violet'
export type Role = 'client' | 'contractor'
export type ProjectStatus = 'draft' | 'awaiting_funding' | 'active' | 'completed'
export type MilestoneStatus = 'pending' | 'available' | 'submitted' | 'released'
export type TransactionStatus = 'signing' | 'pending' | 'confirmed' | 'failed'
export type TransactionType = 'fund' | 'release'
export interface Submission {
  id: string
  summary: string
  url?: string
  submittedAt: string
}
export interface Milestone {
  id: string
  title: string
  description: string
  amount: string
  dueDate: string
  status: MilestoneStatus
  submissions: Submission[]
}
export interface Project {
  id: string
  title: string
  client: string
  description: string
  clientAddress: string
  contractorAddress: string
  network: 'Ethereum Sepolia'
  status: ProjectStatus
  createdAt: string
  milestones: Milestone[]
}
export interface Transaction {
  id: string
  projectId: string
  milestoneId?: string
  type: TransactionType
  amount: string
  recipient: string
  status: TransactionStatus
  createdAt: string
  error?: string
  // Local demo records deliberately have no fabricated chain hash.
}
export interface Workspace {
  projects: Project[]
  transactions: Transaction[]
}
export interface Preferences {
  language: Language
  appearance: Appearance
  accent: Accent
  role: Role
  connected: boolean
}
export interface DraftInput {
  title: string
  description: string
  client: string
  contractorAddress: string
  totalAmount: string
  milestones: { title: string; description: string; amount: string; dueDate: string }[]
}
export const CLIENT_ADDRESS = '0x71C4000000000000000000000000000000008A29'
export const CONTRACTOR_ADDRESS = '0x90A100000000000000000000000000000000bC42'
export const NETWORK = 'Ethereum Sepolia' as const
