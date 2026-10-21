export type ProjectStatus = 'active' | 'review' | 'completed';
export type MilestoneStatus = 'completed' | 'review' | 'in_progress' | 'locked';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export type Project = {
  id: string;
  title: string;
  client: string;
  network: string;
  escrowAmount: string;
  releasedAmount: string;
  currency: string;
  status: ProjectStatus;
  updatedAt: string;
  completion: number;
  color: string;
  milestones: Milestone[];
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: MilestoneStatus;
  evidenceCount: number;
};

export type ChainTransaction = {
  id: string;
  type: 'fund' | 'release' | 'submit';
  title: string;
  projectTitle: string;
  amount?: string;
  network: string;
  hash: string;
  status: TransactionStatus;
  createdAt: string;
};

export type AppLanguage = 'zh-CN' | 'en-US';
export type AccentKey = 'mint' | 'sky' | 'coral' | 'violet';
export type Appearance = 'system' | 'light' | 'dark';
