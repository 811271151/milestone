import { ChainTransaction, Milestone } from '@/domain/models';

export type WalletSnapshot = {
  address: string;
  chainId: number;
  networkName: string;
};

export type ReleaseRequest = {
  projectId: string;
  milestone: Milestone;
  recipient: string;
};

/**
 * The UI depends on this port instead of a wallet SDK. A real EVM adapter can
 * implement the same contract without leaking provider details into screens.
 */
export interface EscrowGateway {
  getWallet(): Promise<WalletSnapshot | null>;
  releaseMilestone(request: ReleaseRequest): Promise<ChainTransaction>;
  submitMilestone(projectId: string, milestoneId: string): Promise<ChainTransaction>;
}
