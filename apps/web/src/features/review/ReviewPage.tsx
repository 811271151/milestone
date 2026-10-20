import { useState } from 'react'
import { ArrowLeft, ExternalLink, FileText, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { isSafeUrl } from '../../domain/workflow'
import {
  Amount,
  Badge,
  Empty,
  Field,
  InfoRow,
  Notice,
  PageHeading,
  SectionHeader,
  TextArea,
} from '../../ui/components'
import { OperationDialog } from './OperationDialog'

export default function ReviewPage() {
  const { id, milestoneId } = useParams()
  const { workspace, deliver, preferences } = useWorkspace()
  const { t, date, errorText } = useI18n()
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [operation, setOperation] = useState(false)
  const project = workspace.projects.find((p) => p.id === id)
  const milestone = project?.milestones.find((m) => m.id === milestoneId)
  if (!project || !milestone)
    return (
      <Empty title={t('projectNotFound')}>
        <Link className="button button-primary" to="/projects">
          {t('backProjects')}
        </Link>
      </Empty>
    )
  return (
    <>
      <Link className="back-link" to={`/projects/${id}`}>
        <ArrowLeft size={16} />
        {project.title}
      </Link>
      <PageHeading
        eyebrow={t('reviewTitle')}
        title={milestone.title}
        description={t('reviewSubtitle')}
      >
        <Badge status={milestone.status === 'pending' ? 'pendingMilestone' : milestone.status} />
      </PageHeading>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="review-main min-w-0">
          <section className="panel review-section">
            <SectionHeader title={t('acceptance')} />
            <p className="leading-relaxed muted">{milestone.description}</p>
            <div className="mt-5 text-sm muted">
              {t('dueDate')} · {date(milestone.dueDate)}
            </div>
          </section>
          <section className="panel review-section">
            <SectionHeader title={t('evidence')} />
            {milestone.submissions.length ? (
              milestone.submissions.map((submission, index) => (
                <article className="evidence-entry" key={submission.id}>
                  <div className="evidence-entry-heading">
                    <span className="evidence-icon">
                      <FileText size={18} />
                    </span>
                    <strong>
                      {t('deliver')} #{index + 1}
                    </strong>
                    <small className="muted">{date(submission.submittedAt)}</small>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{submission.summary}</p>
                  {submission.url && isSafeUrl(submission.url) && (
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="evidence-link"
                    >
                      <ExternalLink size={16} />
                      {t('evidenceLink')}
                      <span>{new URL(submission.url).hostname}</span>
                    </a>
                  )}
                </article>
              ))
            ) : (
              <p className="muted">{t('noEvidence')}</p>
            )}
          </section>
          {milestone.status === 'available' && (
            <form
              className="panel review-section"
              onSubmit={(event) => {
                event.preventDefault()
                try {
                  deliver(project.id, milestone.id, summary, url)
                  setError('')
                } catch (e) {
                  setError(errorText(e))
                }
              }}
            >
              <SectionHeader title={t('deliver')} />
              <p className="muted text-sm mb-5">{t('submitHint')}</p>
              <TextArea
                label={t('deliverySummary')}
                placeholder={t('deliveryPlaceholder')}
                required
                maxLength={10000}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <Field
                label={t('evidenceUrl')}
                placeholder={t('evidencePlaceholder')}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {error && <Notice error>{error}</Notice>}
              {preferences.role !== 'contractor' && <Notice>{t('contractorOnly')}</Notice>}
              <button
                className="button button-primary mt-5"
                type="submit"
                disabled={preferences.role !== 'contractor' || !preferences.connected}
              >
                {t('submitDelivery')}
              </button>
            </form>
          )}
          {milestone.status === 'pending' && (
            <Notice>
              <LockKeyhole size={18} />
              {t('nextLocked')}
            </Notice>
          )}
        </div>
        <aside>
          <div className="panel release-panel">
            <span className="release-icon">
              <ShieldCheck size={24} />
            </span>
            <h2>{t('releaseSummary')}</h2>
            <Amount value={milestone.amount} large />
            <InfoRow label={t('network')}>{project.network}</InfoRow>
            <InfoRow label={t('recipient')}>
              <code>{project.contractorAddress}</code>
            </InfoRow>
            <InfoRow label={t('token')}>USDC ({t('demo')})</InfoRow>
            <Notice>{t('confirmHint')}</Notice>
            {milestone.status === 'submitted' && (
              <>
                <button
                  className="button button-primary w-full mt-5"
                  disabled={preferences.role !== 'client' || !preferences.connected}
                  onClick={() => setOperation(true)}
                >
                  {t('approve')}
                </button>
                {preferences.role !== 'client' && (
                  <p className="muted text-sm mt-3">{t('clientOnly')}</p>
                )}
              </>
            )}
            {milestone.status === 'released' && (
              <div className="mt-5">
                <Badge status="released" />
              </div>
            )}
          </div>
        </aside>
      </div>
      {operation && (
        <OperationDialog project={project} type="release" onClose={() => setOperation(false)} />
      )}
    </>
  )
}
