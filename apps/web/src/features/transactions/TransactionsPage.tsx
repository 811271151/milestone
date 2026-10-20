import { useState } from 'react'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { PageHeading } from '../../ui/components'
import { TransactionTable } from './TransactionTable'

export default function TransactionsPage() {
  const { workspace } = useWorkspace()
  const { t } = useI18n()
  const [status, setStatus] = useState('all')
  return (
    <>
      <PageHeading eyebrow={t('workspace')} title={t('transactions')} description={t('txIntro')} />
      <div className="panel overflow-hidden">
        <div className="table-toolbar">
          <strong>
            {workspace.transactions.length} {t('transactions')}
          </strong>
          <select
            aria-label={t('filterStatus')}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {(['all', 'signing', 'pending', 'confirmed', 'failed'] as const).map((key) => (
              <option key={key} value={key}>
                {t(key === 'pending' ? 'txPending' : key)}
              </option>
            ))}
          </select>
        </div>
        <TransactionTable
          transactions={workspace.transactions.filter(
            (tx) => status === 'all' || tx.status === status,
          )}
        />
      </div>
    </>
  )
}
