import { ChainTransaction, Project } from './models';

export const projects: Project[] = [
  {
    id: 'atlas-mobile',
    title: 'Atlas mobile rebuild',
    client: 'Northstar Studio',
    network: 'Ethereum Sepolia',
    escrowAmount: '4,800.00',
    releasedAmount: '2,400.00',
    currency: 'USDC',
    status: 'active',
    updatedAt: '12 min ago',
    completion: 0.58,
    color: '#76D9C5',
    milestones: [
      { id: 'atlas-1', title: 'Product foundation', description: 'Information architecture, design tokens and handoff notes.', amount: '1,200.00', dueDate: 'Mar 18', status: 'completed', evidenceCount: 4 },
      { id: 'atlas-2', title: 'Core mobile flows', description: 'Project list, milestone detail and wallet states.', amount: '1,200.00', dueDate: 'Mar 27', status: 'review', evidenceCount: 6 },
      { id: 'atlas-3', title: 'Release candidate', description: 'QA fixes, analytics events and production checklist.', amount: '1,200.00', dueDate: 'Apr 05', status: 'in_progress', evidenceCount: 2 },
      { id: 'atlas-4', title: 'Launch handoff', description: 'Store submission assets and maintenance notes.', amount: '1,200.00', dueDate: 'Apr 12', status: 'locked', evidenceCount: 0 },
    ],
  },
  {
    id: 'orbit-brand',
    title: 'Orbit brand system',
    client: 'Orbit Labs',
    network: 'Base Sepolia',
    escrowAmount: '2,650.00',
    releasedAmount: '1,325.00',
    currency: 'USDC',
    status: 'review',
    updatedAt: '1 hour ago',
    completion: 0.64,
    color: '#88B8F7',
    milestones: [
      { id: 'orbit-1', title: 'Visual direction', description: 'Brand principles and visual exploration.', amount: '662.50', dueDate: 'Mar 12', status: 'completed', evidenceCount: 3 },
      { id: 'orbit-2', title: 'Component library', description: 'Reusable web and mobile components.', amount: '662.50', dueDate: 'Mar 22', status: 'review', evidenceCount: 5 },
      { id: 'orbit-3', title: 'Guideline delivery', description: 'Final guidelines and export packages.', amount: '662.50', dueDate: 'Apr 01', status: 'in_progress', evidenceCount: 1 },
      { id: 'orbit-4', title: 'Team enablement', description: 'Workshop and adoption checklist.', amount: '662.50', dueDate: 'Apr 08', status: 'locked', evidenceCount: 0 },
    ],
  },
];

export const transactions: ChainTransaction[] = [
  { id: 'tx-901', type: 'release', title: 'Milestone released', projectTitle: 'Atlas mobile rebuild', amount: '1,200.00 USDC', network: 'Ethereum Sepolia', hash: '0x7ab3...19d2', status: 'confirmed', createdAt: 'Today, 09:42' },
  { id: 'tx-900', type: 'submit', title: 'Review submitted', projectTitle: 'Orbit brand system', network: 'Base Sepolia', hash: '0x11cd...b02a', status: 'pending', createdAt: 'Yesterday, 16:08' },
  { id: 'tx-899', type: 'fund', title: 'Escrow funded', projectTitle: 'Atlas mobile rebuild', amount: '4,800.00 USDC', network: 'Ethereum Sepolia', hash: '0x0fe2...d993', status: 'confirmed', createdAt: 'Mar 08, 14:20' },
];
