import { lazy, Suspense } from 'react'
import { LoaderCircle } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './app/AppShell'
import { WorkspaceProvider } from './state/WorkspaceProvider'
import { useI18n } from './i18n'
import { Empty } from './ui/components'

const ProjectsPage = lazy(() => import('./features/projects/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./features/projects/ProjectDetailPage'))
const ProjectFormPage = lazy(() => import('./features/projects/ProjectFormPage'))
const PendingPage = lazy(() => import('./features/review/PendingPage'))
const ReviewPage = lazy(() => import('./features/review/ReviewPage'))
const TransactionsPage = lazy(() => import('./features/transactions/TransactionsPage'))
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'))
function NotFound() {
  const { t } = useI18n()
  return (
    <Empty title={t('notFound')} description={t('notFoundSub')}>
      <Link className="button button-primary" to="/projects">
        {t('backProjects')}
      </Link>
    </Empty>
  )
}
export default function App() {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="loading-screen">
              <LoaderCircle size={28} className="animate-spin" aria-label="Loading" />
            </div>
          }
        >
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/new" element={<ProjectFormPage key="new" />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="projects/:id/edit" element={<ProjectFormPage key="edit" />} />
              <Route path="projects/:id/milestones/:milestoneId" element={<ReviewPage />} />
              <Route path="pending" element={<PendingPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </WorkspaceProvider>
  )
}
