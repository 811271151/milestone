import { useState } from 'react'
import { ArrowUpRight, Clock3, Plus, Search, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sumAmounts } from '../../domain/money'
import { totals } from '../../domain/workflow'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { Amount, Empty, PageHeading, SectionHeader, TextLink } from '../../ui/components'
import { ProjectCard } from './ProjectCard'
import { EscrowOverview } from './EscrowOverview'
import { TransactionTable } from '../transactions/TransactionTable'

export default function ProjectsPage() {
  const { workspace } = useWorkspace()
  const { t } = useI18n()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const active = workspace.projects.filter((p) => p.status === 'active')
  const reviews = active.flatMap((p) =>
    p.milestones.filter((m) => m.status === 'submitted').map((m) => ({ project: p, milestone: m })),
  )
  const visible = workspace.projects.filter(
    (p) =>
      (filter === 'all' || p.status === filter) &&
      `${p.title} ${p.client}`.toLowerCase().includes(query.toLowerCase()),
  )
  const remaining = sumAmounts(workspace.projects.map((p) => totals(p).remaining))
  const released = sumAmounts(workspace.projects.map((p) => totals(p).released))
  return (
    <>
      <PageHeading eyebrow={t('overview')} title={t('greeting')} description={t('greetingSub')}>
        <Link className="button button-primary" to="/projects/new">
          <Plus size={17} />
          {t('newProject')}
        </Link>
      </PageHeading>
      <section className="dashboard-summary">
        <EscrowOverview remaining={remaining} released={released} activeCount={active.length} />
        <div className="attention-panel panel">
          <div className="section-heading">
            <h2 className="attention-heading">
              <span>
                <Clock3 size={19} />
              </span>
              {t('needsAttention')}
            </h2>
            <span className="review-count">{reviews.length.toString().padStart(2, '0')}</span>
          </div>
          {reviews.length ? (
            <div className="attention-list">
              {reviews.slice(0, 2).map(({ project, milestone }) => (
                <Link
                  className="attention-item"
                  key={milestone.id}
                  to={`/projects/${project.id}/milestones/${milestone.id}`}
                >
                  <div className="attention-line">
                    <strong>{project.title}</strong>
                    <ArrowUpRight size={16} />
                  </div>
                  <p>{milestone.title}</p>
                  <div>
                    <Amount value={milestone.amount} />
                    <span>{t('reviewDelivery')} →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="attention-empty">
              <ShieldCheck size={28} />
              <strong>{t('allClear')}</strong>
              <p>{t('allClearSub')}</p>
            </div>
          )}
        </div>
      </section>
      <section className="project-section">
        <SectionHeader title={t('projectArea')}>
          <span className="section-count">{workspace.projects.length}</span>
        </SectionHeader>
        <div className="list-toolbar">
          <div className="tabs" aria-label={t('status')}>
            {(['all', 'active', 'draft', 'completed'] as const).map((status) => (
              <button
                key={status}
                aria-pressed={filter === status}
                className={filter === status ? 'tab-active' : ''}
                onClick={() => setFilter(status)}
              >
                {t(status)}
              </button>
            ))}
          </div>
          <label className="search-input">
            <Search size={16} />
            <input
              aria-label={t('search')}
              placeholder={t('search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        {visible.length ? (
          <div className="project-grid">
            {visible.map((p, index) => (
              <ProjectCard key={p.id} project={p} index={index} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <Empty title={t('noProjects')} description={t('noProjectsSub')}>
              <Link className="button button-primary" to="/projects/new">
                <Plus size={16} />
                {t('newProject')}
              </Link>
            </Empty>
          </div>
        )}
      </section>
      <section className="activity-section">
        <SectionHeader title={t('recentActivity')}>
          <TextLink to="/transactions">{t('viewAll')}</TextLink>
        </SectionHeader>
        <div className="panel overflow-hidden">
          <TransactionTable transactions={workspace.transactions.slice(0, 4)} />
        </div>
      </section>
    </>
  )
}
