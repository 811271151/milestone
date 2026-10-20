import { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { totals } from '../../domain/workflow'
import {
  Amount,
  Badge,
  CopyAddress,
  Empty,
  InfoRow,
  PageHeading,
  ProjectIcon,
  SectionHeader,
} from '../../ui/components'
import { OperationDialog } from '../review/OperationDialog'
import { TransactionTable } from '../transactions/TransactionTable'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { workspace } = useWorkspace()
  const { t, date } = useI18n()
  const [funding, setFunding] = useState(false)
  const project = workspace.projects.find((p) => p.id === id)
  if (!project)
    return (
      <Empty title={t('projectNotFound')} description={t('projectNotFoundSub')}>
        <Link className="button button-primary" to="/projects">
          {t('backProjects')}
        </Link>
      </Empty>
    )
  const value = totals(project)
  return (
    <>
      <Link className="back-link" to="/projects">
        <ArrowLeft size={16} />
        {t('backProjects')}
      </Link>
      <PageHeading eyebrow={project.client} title={project.title} description={project.description}>
        <Badge status={project.status} />
        {project.status === 'draft' && (
          <Link className="button button-secondary" to={`/projects/${project.id}/edit`}>
            {t('editDraft')}
          </Link>
        )}
        {['draft', 'awaiting_funding'].includes(project.status) && (
          <button className="button button-primary" onClick={() => setFunding(true)}>
            {t('fundProject')}
          </button>
        )}
      </PageHeading>
      <div className="project-detail-grid grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="detail-money panel grid gap-6 sm:grid-cols-3">
            {(['total', 'released', 'remaining'] as const).map((key) => (
              <div key={key}>
                <span className="label-small">{t(key === 'total' ? 'totalBudget' : key)}</span>
                <Amount value={value[key]} />
              </div>
            ))}
          </div>
          <section className="panel timeline-panel">
            <SectionHeader title={t('deliveryPlan')} />
            <p className="muted text-sm mb-7">{t('deliveryPlanSub')}</p>
            <ol className="timeline">
              {project.milestones.map((m, index) => (
                <li key={m.id}>
                  <span className={`timeline-node node-${m.status}`}>
                    {m.status === 'released' ? (
                      <Check size={17} />
                    ) : m.status === 'pending' ? (
                      <LockKeyhole size={15} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="timeline-content">
                    <div className="timeline-title">
                      <h3>{m.title}</h3>
                      <Badge status={m.status === 'pending' ? 'pendingMilestone' : m.status} />
                    </div>
                    <p>{m.description}</p>
                    <div className="timeline-meta">
                      <span>
                        {t('dueDate')} · {date(m.dueDate)}
                      </span>
                      <Amount value={m.amount} />
                    </div>
                    <Link className="text-link" to={`/projects/${project.id}/milestones/${m.id}`}>
                      {t(
                        m.status === 'submitted'
                          ? 'reviewDelivery'
                          : m.status === 'available'
                            ? 'deliver'
                            : 'viewDelivery',
                      )}
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <aside className="detail-aside">
          <div className="panel participant-panel">
            <ProjectIcon title={project.title} />
            <h2>{t('participants')}</h2>
            <span className="label-small">
              {t('client')} · {project.client}
            </span>
            <CopyAddress value={project.clientAddress} />
            <span className="label-small">{t('contractor')}</span>
            <CopyAddress value={project.contractorAddress} />
            <InfoRow label={t('network')}>{project.network}</InfoRow>
            <InfoRow label={t('token')}>USDC ({t('demo')})</InfoRow>
          </div>
          <div className="info-card">
            <ShieldCheck size={25} />
            <h3>{t('rulesTitle')}</h3>
            <p>{t('rulesSub')}</p>
          </div>
        </aside>
      </div>
      <section className="activity-section">
        <SectionHeader title={t('transactions')} />
        <div className="panel overflow-hidden">
          <TransactionTable
            transactions={workspace.transactions.filter((tx) => tx.projectId === project.id)}
          />
        </div>
      </section>
      {funding && (
        <OperationDialog project={project} type="fund" onClose={() => setFunding(false)} />
      )}
    </>
  )
}
