import type { Project, Workspace } from './models'
import { CLIENT_ADDRESS, CONTRACTOR_ADDRESS, NETWORK } from './models'

const createdAt = '2026-10-10T09:00:00.000Z'
function sample(
  id: string,
  title: string,
  client: string,
  amount: string,
  names: string[],
): Project {
  return {
    id,
    title,
    client,
    description: `${title} — project delivery & milestone escrow.`,
    clientAddress: CLIENT_ADDRESS,
    contractorAddress: CONTRACTOR_ADDRESS,
    network: NETWORK,
    createdAt,
    status: 'active',
    milestones: names.map((name, i) => ({
      id: `${id}-${i + 1}`,
      title: name,
      description: 'Deliver the agreed scope, a reviewable preview, and handoff documentation.',
      amount,
      dueDate: `2026-${i < 2 ? '10' : '11'}-${i % 2 === 0 ? '15' : '27'}`,
      status: i === 0 ? 'released' : i === 1 ? 'submitted' : 'pending',
      submissions:
        i > 1
          ? []
          : [
              {
                id: `${id}-s${i}`,
                summary:
                  'Implementation and handoff notes are ready for review. Please verify the agreed acceptance criteria.',
                url: 'https://reactnative.dev/docs/getting-started',
                submittedAt: '2026-10-20T08:30:00.000Z',
              },
            ],
    })),
  }
}
export function initialWorkspace(): Workspace {
  const projects = [
    sample('atlas-mobile', 'Atlas mobile rebuild', 'Northstar Studio', '1200', [
      'Product foundation',
      'Core mobile flows',
      'Release candidate',
      'Launch handoff',
    ]),
    sample('orbit-brand', 'Orbit brand system', 'Orbit Labs', '662.5', [
      'Visual direction',
      'Component library',
      'Guideline delivery',
      'Team enablement',
    ]),
  ]
  return {
    projects,
    transactions: projects.flatMap((p) => [
      {
        id: `demo-release-${p.id}`,
        projectId: p.id,
        milestoneId: p.milestones[0].id,
        type: 'release' as const,
        amount: p.milestones[0].amount,
        recipient: CONTRACTOR_ADDRESS,
        status: 'confirmed' as const,
        createdAt: '2026-10-16T09:42:00.000Z',
      },
      {
        id: `demo-fund-${p.id}`,
        projectId: p.id,
        type: 'fund' as const,
        amount: p.id === 'atlas-mobile' ? '4800' : '2650',
        recipient: 'Demo Escrow',
        status: 'confirmed' as const,
        createdAt,
      },
    ]),
  }
}
