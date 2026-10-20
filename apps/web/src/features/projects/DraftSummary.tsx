import { Check, CircleDashed, FileCheck2, Info, Layers3, Wallet } from 'lucide-react'
import type { DraftInput } from '../../domain/models'
import { toUnits } from '../../domain/money'
import { validateDraft } from '../../domain/workflow'
import { useI18n } from '../../i18n'
import { Amount, Badge } from '../../ui/components'
import { draftBudget } from './draftBudget'

function previewAmount(value: string) {
  try {
    toUnits(value)
    return <Amount value={value} />
  } catch {
    return <span className="muted">—</span>
  }
}

export function DraftSummary({ form }: { form: DraftInput }) {
  const { t, errorText } = useI18n()
  const budget = draftBudget(
    form.totalAmount,
    form.milestones.map((m) => m.amount),
  )
  let ready = true
  let hint = t('draftReadyHint')
  try {
    validateDraft(form)
  } catch (error) {
    ready = false
    hint = errorText(error)
  }
  const budgetLabel =
    budget.status === 'balanced'
      ? 'budgetBalanced'
      : budget.status === 'over'
        ? 'budgetOver'
        : budget.status === 'under'
          ? 'budgetUnder'
          : budget.status === 'invalid'
            ? 'budgetInvalid'
            : 'budgetIncomplete'
  return (
    <aside className="draft-summary" aria-label={t('collaborationPreview')}>
      <section className="panel draft-preview-card">
        <div className="draft-preview-top">
          <span>
            <Layers3 size={18} />
            {t('collaborationPreview')}
          </span>
          <Badge status="draft" />
        </div>
        <div className="draft-preview-identity">
          <span className="draft-project-mark">
            <FileCheck2 size={25} strokeWidth={1.6} />
          </span>
          <div>
            <h2>{form.title.trim() || t('untitledProject')}</h2>
            <p>{form.client.trim() || t('partnerPending')}</p>
          </div>
        </div>
        <span className="label-small">{t('totalBudget')}</span>
        <div className="draft-preview-total">{previewAmount(form.totalAmount)}</div>
        <div className="draft-budget-row">
          <span>{t('milestoneSum')}</span>
          {budget.allocated === null ? '—' : <Amount value={budget.allocated} />}
        </div>
        <div
          className={`budget-feedback budget-${budget.status}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {budget.status === 'balanced' ? <Check size={16} /> : <Info size={16} />}
          <span>
            {t(budgetLabel)}
            {budget.difference &&
              budget.status !== 'balanced' &&
              budget.status !== 'incomplete' && (
                <>
                  {' '}
                  · <Amount value={budget.difference} />
                </>
              )}
          </span>
        </div>
        <div className="draft-plan-heading">
          <span>{t('deliverySequence')}</span>
          <span>{String(form.milestones.length).padStart(2, '0')}</span>
        </div>
        <ol className="draft-plan">
          {form.milestones.map((milestone, index) => (
            <li key={index}>
              <span className="draft-plan-node">{index + 1}</span>
              <div>
                <strong>{milestone.title.trim() || `${t('milestone')} ${index + 1}`}</strong>
                <small>{milestone.dueDate || t('datePending')}</small>
              </div>
              {previewAmount(milestone.amount)}
            </li>
          ))}
        </ol>
        <div className="draft-network">
          <Wallet size={15} />
          <span>Ethereum Sepolia</span>
          <span>USDC</span>
        </div>
      </section>
      <section className={`draft-readiness ${ready ? 'is-ready' : ''}`}>
        {ready ? <Check size={19} /> : <CircleDashed size={19} />}
        <div>
          <strong>{t(ready ? 'draftReady' : 'draftInProgress')}</strong>
          <p>{hint}</p>
        </div>
      </section>
      <div className="draft-process">
        <span>01 {t('saveDraft')}</span>
        <i />
        <span>02 {t('fundProject')}</span>
        <i />
        <span>03 {t('deliver')}</span>
      </div>
    </aside>
  )
}
