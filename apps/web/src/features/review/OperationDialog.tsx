import { useState } from 'react'
import { CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import type { Project, TransactionType } from '../../domain/models'
import { currentMilestone, totals } from '../../domain/workflow'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { Amount, Badge, Dialog, InfoRow, Notice } from '../../ui/components'

export function OperationDialog({
  project,
  type,
  onClose,
}: {
  project: Project
  type: TransactionType
  onClose: () => void
}) {
  const { execute, workspace, busy } = useWorkspace()
  const { t, errorText } = useI18n()
  const [fail, setFail] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [amount] = useState(() =>
    type === 'fund' ? totals(project).total : (currentMilestone(project)?.amount ?? '0'),
  )
  const [existingIds] = useState(() => new Set(workspace.transactions.map((item) => item.id)))
  const tx = workspace.transactions.find(
    (item) => item.projectId === project.id && item.type === type && !existingIds.has(item.id),
  )
  const run = async () => {
    setStarted(true)
    try {
      await execute(project.id, type, fail)
      setDone(true)
    } catch (e) {
      setError(errorText(e))
    }
  }
  return (
    <Dialog
      title={t(type === 'fund' ? 'confirmFund' : 'confirmRelease')}
      onClose={onClose}
      locked={busy}
    >
      <div className="operation-visual">
        {done ? (
          <CheckCircle2 size={34} />
        ) : busy ? (
          <LoaderCircle className="animate-spin" size={34} />
        ) : (
          <ShieldCheck size={34} />
        )}
      </div>
      <div className="operation-amount">
        <Amount value={amount} large />
      </div>
      <InfoRow label={t('project')}>{project.title}</InfoRow>
      <InfoRow label={t('network')}>{project.network}</InfoRow>
      <InfoRow label={t('recipient')}>
        <code>{type === 'fund' ? 'Demo Escrow' : project.contractorAddress}</code>
      </InfoRow>
      <Notice>{t('confirmHint')}</Notice>
      {!started && (
        <label className="checkbox-row">
          <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} />
          {t('simulateFailure')}
        </label>
      )}
      {started && tx && (
        <div className="operation-status">
          <Badge status={tx.status} />
        </div>
      )}
      {done && <Notice>{t('simulationSuccess')}</Notice>}
      {error && (
        <Notice error>
          {error}
          <br />
          {t('operationFailed')}
        </Notice>
      )}
      <div className="dialog-actions">
        <button className="button button-secondary" disabled={busy} onClick={onClose}>
          {t(started ? 'close' : 'cancel')}
        </button>
        {!started && (
          <button className="button button-primary" onClick={run} disabled={busy}>
            {t('confirmAction')}
          </button>
        )}
      </div>
    </Dialog>
  )
}
