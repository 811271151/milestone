import { ArrowUpRight, Check, Clock3, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../domain/models'
import { currentMilestone, totals } from '../../domain/workflow'
import { useI18n } from '../../i18n'
import { Amount, Badge, ProjectIcon } from '../../ui/components'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useI18n()
  const { total, released } = totals(project)
  const completed = project.milestones.filter((m) => m.status === 'released').length
  const current = currentMilestone(project)
  return (
    <article className="project-card panel">
      <div className="project-card-head">
        <ProjectIcon title={project.title} index={index} />
        <div className="min-w-0 flex-1">
          <Link to={`/projects/${project.id}`} className="project-title-link">
            <h3>{project.title}</h3>
          </Link>
          <p>{project.client}</p>
        </div>
        <Link
          className="icon-button"
          aria-label={`${t('openProject')}: ${project.title}`}
          to={`/projects/${project.id}`}
        >
          <ArrowUpRight size={20} />
        </Link>
      </div>
      <div className="project-value">
        <div>
          <span className="label-small">{t('totalBudget')}</span>
          <Amount value={total} />
        </div>
        <Badge status={project.status} />
      </div>
      <div className="project-progress">
        <div className="flex items-center justify-between">
          <span>{t('milestoneProgress')}</span>
          <strong>
            {completed}
            <span> / {project.milestones.length}</span>
          </strong>
        </div>
        <div className="milestone-strip" aria-label={t('currentProgress')}>
          {project.milestones.map((milestone, step) => (
            <Link
              key={milestone.id}
              to={`/projects/${project.id}/milestones/${milestone.id}`}
              className={`milestone-segment segment-${milestone.status}`}
              title={`${milestone.title} · ${t(milestone.status === 'pending' ? 'milestonePending' : milestone.status)}`}
              aria-label={`${step + 1}. ${milestone.title} · ${t(milestone.status === 'pending' ? 'milestonePending' : milestone.status)}`}
            >
              {milestone.status === 'released' ? (
                <Check size={12} />
              ) : (
                <span>{String(step + 1).padStart(2, '0')}</span>
              )}
              <i />
            </Link>
          ))}
        </div>
      </div>
      <div className="project-current">
        <span className="current-icon">
          <Layers3 size={16} />
        </span>
        <div>
          <span className="label-small">{t('currentStage')}</span>
          <strong>{current?.title ?? t('completed')}</strong>
        </div>
        {current?.status === 'submitted' && <span className="review-dot" title={t('submitted')} />}
      </div>
      <div className="project-card-foot">
        <span>
          {t('released')}{' '}
          <strong>
            <Amount value={released} />
          </strong>
        </span>
        <span>
          <Clock3 size={12} /> Sepolia
        </span>
      </div>
    </article>
  )
}
