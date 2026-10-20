import { useEffect, useId, useRef } from 'react'
import type {
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'
import { ArrowUpRight, Check, Copy, FolderOpen, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CopyKey } from '../i18n'
import { useI18n } from '../i18n'
import { formatMoney } from '../domain/money'

export function Amount({ value, large = false }: { value: string; large?: boolean }) {
  const { locale } = useI18n()
  return (
    <span className={large ? 'amount amount-large' : 'amount'}>
      {formatMoney(value, locale)} <small>USDC</small>
    </span>
  )
}
export function Badge({ status }: { status: string }) {
  const { t } = useI18n()
  const key =
    (
      {
        pending: 'txPending',
        pendingMilestone: 'milestonePending',
        released: 'released',
      } as Record<string, CopyKey>
    )[status] ?? (status as CopyKey)
  return (
    <span className={`badge badge-${status}`}>
      <span className="status-dot" />
      {t(key)}
    </span>
  )
}
export function Empty({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <FolderOpen size={27} />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: PropsWithChildren<{ eyebrow?: string; title: string; description?: string }>) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  )
}
export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {props.required && <b className="required"> *</b>}
      </span>
      <input id={id} {...props} />
    </label>
  )
}
export function TextArea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const id = useId()
  return (
    <label className="field" htmlFor={id}>
      <span>
        {label}
        {props.required && <b className="required"> *</b>}
      </span>
      <textarea id={id} rows={4} {...props} />
    </label>
  )
}
export function Dialog({
  title,
  children,
  onClose,
  locked = false,
}: PropsWithChildren<{ title: string; onClose: () => void; locked?: boolean }>) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const { t } = useI18n()
  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        if (!locked) onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !locked) onClose()
      }}
    >
      <div className="dialog-inner">
        <header>
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className="icon-button"
            disabled={locked}
            onClick={onClose}
            aria-label={t('close')}
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
export function SectionHeader({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
export function ProjectIcon({ title, index = 0 }: { title: string; index?: number }) {
  return (
    <div className={`project-icon project-icon-${index % 3}`}>
      {title
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0])
        .join('')
        .toUpperCase()}
    </div>
  )
}
export function TextLink({ to, children }: PropsWithChildren<{ to: string }>) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowUpRight size={15} />
    </Link>
  )
}
export function InfoRow({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  )
}
export function Notice({ children, error = false }: PropsWithChildren<{ error?: boolean }>) {
  return (
    <div className={error ? 'notice notice-error' : 'notice'} role={error ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
export function CopyAddress({ value }: { value: string }) {
  const { t } = useI18n()
  return (
    <div className="address-copy">
      <code>{value}</code>
      <button
        className="icon-button"
        type="button"
        title={t('copy')}
        aria-label={t('copy')}
        onClick={async (e) => {
          const button = e.currentTarget
          try {
            await navigator.clipboard.writeText(value)
            button.title = t('addressCopied')
          } catch {
            button.title = t('copyFailed')
          }
        }}
      >
        <Copy size={14} />
      </button>
    </div>
  )
}
export function Choice({
  selected,
  onClick,
  children,
  icon,
}: PropsWithChildren<{ selected: boolean; onClick: () => void; icon?: ReactNode }>) {
  return (
    <button
      type="button"
      className={`choice ${selected ? 'selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon}
      {children}
      {selected && <Check size={16} className="choice-check" />}
    </button>
  )
}
