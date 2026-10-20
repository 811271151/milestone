import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Transaction } from '../../domain/models'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { Amount, Badge, Dialog, Empty, InfoRow, Notice } from '../../ui/components'

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const { workspace } = useWorkspace()
  const { t, date, errorText } = useI18n()
  const [selected, setSelected] = useState<Transaction | null>(null)
  if (!transactions.length)
    return <Empty title={t('noTransactions')} description={t('noTransactionsSub')} />
  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t('transactionType')}</th>
              <th>{t('project')}</th>
              <th>{t('amount')}</th>
              <th>{t('status')}</th>
              <th>{t('time')}</th>
              <th>
                <span className="sr-only">{t('action')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const project = workspace.projects.find((p) => p.id === tx.projectId)
              return (
                <tr key={tx.id}>
                  <td>
                    <div className="transaction-type">
                      <span
                        className={`transaction-icon ${tx.type === 'release' ? 'transaction-out' : ''}`}
                      >
                        {tx.type === 'fund' ? (
                          <ArrowDownLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </span>
                      <strong>{t(tx.type)}</strong>
                    </div>
                  </td>
                  <td>
                    <Link className="table-project" to={`/projects/${tx.projectId}`}>
                      {project?.title ?? tx.projectId}
                    </Link>
                    <small>Ethereum Sepolia</small>
                  </td>
                  <td>
                    <Amount value={tx.amount} />
                  </td>
                  <td>
                    <Badge status={tx.status} />
                  </td>
                  <td className="whitespace-nowrap muted">{date(tx.createdAt)}</td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`${t('details')}: ${tx.id}`}
                      onClick={() => setSelected(tx)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {selected && (
        <Dialog title={t('txDetails')} onClose={() => setSelected(null)}>
          <InfoRow label={t('transactionType')}>{t(selected.type)}</InfoRow>
          <InfoRow label={t('amount')}>
            <Amount value={selected.amount} />
          </InfoRow>
          <InfoRow label={t('status')}>
            <Badge status={selected.status} />
          </InfoRow>
          <InfoRow label={t('network')}>Ethereum Sepolia</InfoRow>
          <InfoRow label={t('recipient')}>
            <code>{selected.recipient}</code>
          </InfoRow>
          <InfoRow label={t('transactionId')}>
            <code>{selected.id}</code>
          </InfoRow>
          <Notice>{t('noChainHash')}</Notice>
          {selected.error && <Notice error>{errorText(selected.error)}</Notice>}
          <div className="dialog-actions">
            <button className="button button-primary" onClick={() => setSelected(null)}>
              {t('close')}
            </button>
          </div>
        </Dialog>
      )}
    </>
  )
}
