import { ChainTransaction } from '@/domain/models';
import { EscrowGateway, ReleaseRequest, WalletSnapshot } from './escrowGateway';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockEscrowGateway: EscrowGateway = {
  async getWallet(): Promise<WalletSnapshot> {
    await delay(180);
    return { address: '0x71C4...8A29', chainId: 11155111, networkName: 'Ethereum Sepolia' };
  },
  async releaseMilestone(request: ReleaseRequest): Promise<ChainTransaction> {
    await delay(550);
    return { id: `tx-release-${request.milestone.id}`, type: 'release', title: 'Milestone release requested', projectTitle: request.projectId, amount: `${request.milestone.amount} USDC`, network: 'Ethereum Sepolia', hash: '0xmock...pending', status: 'pending', createdAt: 'Just now' };
  },
  async submitMilestone(projectId: string, milestoneId: string): Promise<ChainTransaction> {
    await delay(450);
    return { id: `tx-submit-${milestoneId}`, type: 'submit', title: 'Review submitted', projectTitle: projectId, network: 'Ethereum Sepolia', hash: '0xmock...pending', status: 'pending', createdAt: 'Just now' };
  },
};
