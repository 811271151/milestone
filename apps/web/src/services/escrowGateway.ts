import type { Transaction } from '../domain/models'

export interface EscrowGateway {
  execute(
    transaction: Transaction,
    onStatus: (status: Transaction['status']) => void,
    fail?: boolean,
  ): Promise<void>
}
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
/** Simulation only: no RPC, no wallet signatures, no transaction hash. */
export const demoEscrowGateway: EscrowGateway = {
  async execute(_transaction, onStatus, fail = false) {
    onStatus('signing')
    await wait(650)
    onStatus('pending')
    await wait(1000)
    if (fail) throw new Error('demoFailure')
    onStatus('confirmed')
  },
}
