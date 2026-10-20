import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  CircleHelp,
  Clock3,
  FolderKanban,
  Layers3,
  Menu,
  Plus,
  Settings2,
  Wallet,
  X,
  ArrowLeftRight,
  Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useWorkspace } from '../state/context'
import { useI18n } from '../i18n'
import type { CopyKey } from '../i18n'
import { Notice } from '../ui/components'

const navigation: { to: string; key: CopyKey; icon: LucideIcon }[] = [
  { to: '/projects', key: 'projects', icon: FolderKanban },
  { to: '/pending', key: 'pending', icon: Clock3 },
  { to: '/transactions', key: 'transactions', icon: ArrowLeftRight },
  { to: '/settings', key: 'settings', icon: Settings2 },
]
export default function AppShell() {
  const { preferences, setPreferences, workspace, storageWarning, busy } = useWorkspace()
  const { t } = useI18n()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const pendingCount = workspace.projects
    .flatMap((p) => p.milestones)
    .filter((m) => m.status === 'submitted').length
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      document.documentElement.dataset.theme =
        preferences.appearance === 'system'
          ? query.matches
            ? 'dark'
            : 'light'
          : preferences.appearance
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [preferences.appearance])
  useEffect(() => {
    document.documentElement.dataset.accent = preferences.accent
    document.documentElement.lang = preferences.language
    document.title = `Milestone · ${t(navigation.find((item) => location.pathname.startsWith(item.to))?.key ?? 'projects')}`
  }, [preferences.accent, preferences.language, location.pathname, t])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {t('skipContent')}
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label={t('closeMenu')}
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}
        onClick={(event) => {
          if ((event.target as Element).closest('a')) setMenuOpen(false)
        }}
      >
        <Link to="/projects" className="brand">
          <span className="brand-mark">
            <Layers3 size={24} strokeWidth={2.1} />
          </span>
          <span>
            Milestone<span className="brand-dot">.</span>
          </span>
        </Link>
        <Link className="workspace-switch" to="/settings">
          <div className="workspace-avatar">A</div>
          <div>
            <strong>Alex’s workspace</strong>
            <small>{t('productTag')}</small>
          </div>
          <ArrowUpRight size={16} />
        </Link>
        <div className="nav-label">{t('workspace')}</div>
        <nav aria-label={t('workspace')}>
          {navigation.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{t(key)}</span>
              {key === 'pending' && pendingCount > 0 && (
                <span className="nav-count">{pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/projects/new" className="sidebar-create">
            <Plus size={17} />
            <span>{t('newProject')}</span>
          </Link>
          <div className="sidebar-footer">
            <span className="demo-dot" /> {t('demo')}
            <span>v0.1</span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? t('closeMenu') : t('menu')}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="breadcrumb">
              {t('workspace')}
              <span>/</span>
              <strong>
                {t(navigation.find((n) => location.pathname.startsWith(n.to))?.key ?? 'projects')}
              </strong>
            </span>
          </div>
          <div className="topbar-actions">
            <span className="network-chip">
              <span />
              Ethereum Sepolia
            </span>
            <label className="role-select">
              <span>{t('demoRole')}</span>
              <select
                aria-label={t('demoRole')}
                disabled={busy}
                value={preferences.role}
                onChange={(e) =>
                  setPreferences({ role: e.target.value as 'client' | 'contractor' })
                }
              >
                <option value="client">{t('client')}</option>
                <option value="contractor">{t('contractor')}</option>
              </select>
            </label>
            <Link className="icon-button notification-link" to="/pending" aria-label={t('pending')}>
              <Bell size={19} />
              {pendingCount > 0 && <i />}
            </Link>
            <Link className="profile-avatar" to="/settings" aria-label={t('settings')}>
              AL
            </Link>
          </div>
        </header>
        <div className="demo-banner">
          <CircleHelp size={15} />
          <span>{t('demoNotice')}</span>
          <Link to="/settings">
            {t('demoWallet')}
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <main id="main-content" tabIndex={-1}>
          <div className="content-container">
            {storageWarning && <Notice error>{t('storageWarning')}</Notice>}
            {!preferences.connected && (
              <Notice>
                <Wallet size={18} />
                {t('connectFirst')}{' '}
                <Link to="/settings" className="text-link">
                  {t('settings')}
                </Link>
              </Notice>
            )}
            <Outlet />
          </div>
        </main>
        <footer className="main-footer">
          <span>Milestone / {t('demo')}</span>
          <span>{t('localData')}</span>
        </footer>
      </div>
    </div>
  )
}
