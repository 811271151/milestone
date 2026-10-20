import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { DraftInput } from '../../domain/models'
import { totals } from '../../domain/workflow'
import { DraftSummary } from './DraftSummary'
import { draftBudget } from './draftBudget'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import {
  Amount,
  Empty,
  Field,
  Notice,
  PageHeading,
  SectionHeader,
  TextArea,
} from '../../ui/components'

const emptyMilestone = () => ({ title: '', amount: '', description: '', dueDate: '' })
export default function ProjectFormPage() {
  const { id } = useParams()
  const { workspace, saveDraft } = useWorkspace()
  const { t, errorText } = useI18n()
  const navigate = useNavigate()
  const original = workspace.projects.find((p) => p.id === id)
  const [form, setForm] = useState<DraftInput>(() =>
    original
      ? {
          title: original.title,
          description: original.description,
          client: original.client,
          contractorAddress: original.contractorAddress,
          totalAmount: totals(original).total,
          milestones: original.milestones.map(({ title, description, amount, dueDate }) => ({
            title,
            description,
            amount,
            dueDate,
          })),
        }
      : {
          title: '',
          description: '',
          client: '',
          contractorAddress: '',
          totalAmount: '',
          milestones: [emptyMilestone()],
        },
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  if (id && (!original || original.status !== 'draft'))
    return (
      <Empty title={t('invalidState')}>
        <Link to="/projects" className="button button-primary">
          {t('backProjects')}
        </Link>
      </Empty>
    )
  const change = (key: keyof Omit<DraftInput, 'milestones'>, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))
  const changeMilestone = (
    index: number,
    key: keyof DraftInput['milestones'][number],
    value: string,
  ) =>
    setForm((f) => ({
      ...f,
      milestones: f.milestones.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    }))
  const budget = draftBudget(
    form.totalAmount,
    form.milestones.map((m) => m.amount),
  )
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const projectId = saveDraft(form, id)
      navigate(`/projects/${projectId}`)
    } catch (e) {
      setError(errorText(e))
      setSaving(false)
    }
  }
  return (
    <>
      <Link to="/projects" className="back-link">
        <ArrowLeft size={16} />
        {t('backProjects')}
      </Link>
      <PageHeading
        eyebrow={t('projects')}
        title={t(id ? 'editTitle' : 'draftTitle')}
        description={t('draftIntro')}
      />
      <form className="project-form" onSubmit={save}>
        <nav className="form-section-nav" aria-label={t('formSections')}>
          <a href="#project-basics">
            <span>01</span>
            {t('basicInfo')}
          </a>
          <a href="#project-milestones">
            <span>02</span>
            {t('deliveryPlan')}
            <small>{form.milestones.length} / 5</small>
          </a>
        </nav>
        <div className="project-form-main">
          <section className="panel form-section" id="project-basics">
            <SectionHeader title={t('basicInfo')}>
              <span className="section-index">01 / 02</span>
            </SectionHeader>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={t('projectName')}
                placeholder={t('projectNamePlaceholder')}
                maxLength={120}
                required
                value={form.title}
                onChange={(e) => change('title', e.target.value)}
              />
              <Field
                label={t('partnerName')}
                placeholder={t('partnerPlaceholder')}
                required
                maxLength={100}
                value={form.client}
                onChange={(e) => change('client', e.target.value)}
              />
            </div>
            <TextArea
              label={t('description')}
              rows={3}
              placeholder={t('descriptionPlaceholder')}
              required
              maxLength={5000}
              value={form.description}
              onChange={(e) => change('description', e.target.value)}
            />
            <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
              <Field
                label={t('contractorAddress')}
                placeholder="0x…"
                required
                value={form.contractorAddress}
                onChange={(e) => change('contractorAddress', e.target.value)}
              />
              <Field
                label={t('totalAmount')}
                placeholder="0.00"
                inputMode="decimal"
                required
                value={form.totalAmount}
                onChange={(e) => change('totalAmount', e.target.value)}
              />
            </div>
          </section>
          <section className="panel form-section" id="project-milestones">
            <SectionHeader title={t('milestones')}>
              <span className="section-count">{form.milestones.length} / 5</span>
            </SectionHeader>
            <p className="muted text-sm">{t('milestoneHint')}</p>
            <div className="milestone-fields">
              {form.milestones.map((m, index) => (
                <fieldset key={index}>
                  <legend className="sr-only">
                    {t('milestone')} {index + 1}
                  </legend>
                  <div className="milestone-card-heading" aria-hidden="true">
                    <span className="step-number">{index + 1}</span>
                    <strong>
                      {t('milestone')} {index + 1}
                    </strong>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <Field
                      label={t('milestoneName')}
                      required
                      maxLength={120}
                      value={m.title}
                      onChange={(e) => changeMilestone(index, 'title', e.target.value)}
                    />
                    <Field
                      label={t('amount')}
                      required
                      inputMode="decimal"
                      placeholder="USDC"
                      value={m.amount}
                      onChange={(e) => changeMilestone(index, 'amount', e.target.value)}
                    />
                  </div>
                  <TextArea
                    label={t('criteria')}
                    rows={3}
                    required
                    maxLength={3000}
                    value={m.description}
                    onChange={(e) => changeMilestone(index, 'description', e.target.value)}
                  />
                  <div className="flex items-end justify-between gap-4">
                    <Field
                      label={t('dueDate')}
                      type="date"
                      required
                      value={m.dueDate}
                      onChange={(e) => changeMilestone(index, 'dueDate', e.target.value)}
                    />
                    <button
                      type="button"
                      className="button button-quiet"
                      disabled={form.milestones.length === 1}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          milestones: f.milestones.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={15} />
                      {t('remove')}
                    </button>
                  </div>
                </fieldset>
              ))}
            </div>
            <button
              type="button"
              className="button button-secondary"
              disabled={form.milestones.length >= 5}
              onClick={() =>
                setForm((f) => ({ ...f, milestones: [...f.milestones, emptyMilestone()] }))
              }
            >
              <Plus size={16} />
              {t('addMilestone')}
            </button>
          </section>
          {error && <Notice error>{error}</Notice>}
          <div className="form-save-bar panel">
            <div>
              <span className="label-small">{t('milestoneSum')}</span>
              {budget.allocated === null ? '—' : <Amount value={budget.allocated} />}
            </div>
            <button type="submit" className="button button-primary" disabled={saving}>
              <Save size={16} />
              {t('saveDraft')}
            </button>
          </div>
        </div>
        <DraftSummary form={form} />
      </form>
    </>
  )
}
