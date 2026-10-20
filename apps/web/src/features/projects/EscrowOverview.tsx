import { ArrowUpRight, FolderKanban, Wallet } from 'lucide-react'
import { toUnits } from '../../domain/money'
import { useI18n } from '../../i18n'
import { Amount } from '../../ui/components'

export function EscrowOverview({
  remaining,
  released,
  activeCount,
}: {
  remaining: string
  released: string
  activeCount: number
}) {
  const { t } = useI18n()
  const total = toUnits(remaining) + toUnits(released)
  const releasedPercent = total ? Number((toUnits(released) * 10000n) / total) / 100 : 0

  return (
    <div className="balance-panel">
      <div className="balance-top">
        <div className="balance-caption">
          <span className="balance-symbol">
            <Wallet size={23} strokeWidth={1.7} />
          </span>
          <span>
            {t('activeEscrow')}
            <small>{t('demoAmounts')}</small>
          </span>
        </div>
        <span className="balance-network">
          <span />
          Ethereum Sepolia
        </span>
      </div>
      <div className="balance-value">
        <Amount value={remaining} large />
      </div>
      <div className="escrow-allocation" aria-hidden="true">
        <span style={{ width: `${100 - releasedPercent}%` }} />
        <span style={{ width: `${releasedPercent}%` }} />
      </div>
      <div className="balance-bottom">
        <div className="balance-metric">
          <span className="metric-icon">
            <ArrowUpRight size={19} />
          </span>
          <div>
            <span>{t('releasedTotal')}</span>
            <Amount value={released} />
          </div>
        </div>
        <div className="balance-metric">
          <span className="metric-icon">
            <FolderKanban size={19} />
          </span>
          <div>
            <span>{t('activeProjects')}</span>
            <strong className="balance-count">{activeCount.toString().padStart(2, '0')}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
