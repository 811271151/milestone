import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { Amount, Badge, Empty, PageHeading, ProjectIcon, SectionHeader } from '../../ui/components'

export default function PendingPage() {
  const { workspace } = useWorkspace()
  const { t, date, errorText } = useI18n()
  const reviews = workspace.projects.flatMap((p) =>
    p.milestones.filter((m) => m.status === 'submitted').map((m) => ({ p, m })),
  )
  const unresolved = workspace.transactions.filter(
    (tx) =>
      tx.status !== 'confirmed' &&
      !workspace.transactions.some(
        (other) =>
          other.projectId === tx.projectId &&
          other.type === tx.type &&
          other.milestoneId === tx.milestoneId &&
          other.status === 'confirmed',
      ),
  )
  return (
    <>
      <PageHeading eyebrow={t('workspace')} title={t('pending')} description={t('pendingIntro')} />
      <SectionHeader title={t('awaitingReview')}>
        <span className="section-count">{reviews.length}</span>
      </SectionHeader>
      <div className="grid gap-5 xl:grid-cols-2">
        {reviews.map(({ p, m }, index) => (
          <article className="panel review-card" key={m.id}>
            <div className="flex items-center gap-3">
              <ProjectIcon title={p.title} index={index} />
              <div className="flex-1">
                <h3>{p.title}</h3>
                <p className="muted text-sm">{p.client}</p>
              </div>
              <Badge status="submitted" />
            </div>
            <h2>{m.title}</h2>
            <p className="muted leading-relaxed">{m.description}</p>
            <div className="review-card-meta">
              <span>
                <Clock3 size={15} />
                {t('dueDate')} · {date(m.dueDate)}
              </span>
              <span>
                {m.submissions.length} {t('deliveryCount')}
              </span>
            </div>
            <div className="review-card-footer">
              <Amount value={m.amount} />
              <Link to={`/projects/${p.id}/milestones/${m.id}`} className="button button-primary">
                {t('reviewDelivery')} →
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!reviews.length && (
        <div className="panel">
          <Empty title={t('allClear')} description={t('allClearSub')} />
        </div>
      )}
      {unresolved.length > 0 && (
        <section className="activity-section">
          <SectionHeader title={t('failedOperations')} />
          <div className="panel divide-list">
            {unresolved.map((tx) => (
              <div className="failed-row" key={tx.id}>
                <div>
                  <Badge status={tx.status} />
                  <p>{workspace.projects.find((p) => p.id === tx.projectId)?.title}</p>
                  <small className="muted">
                    {tx.error ? errorText(tx.error) : t('processing')}
                  </small>
                </div>
                <Link
                  className="button button-secondary"
                  to={
                    tx.type === 'release'
                      ? `/projects/${tx.projectId}/milestones/${tx.milestoneId}`
                      : `/projects/${tx.projectId}`
                  }
                >
                  {t('retry')}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
