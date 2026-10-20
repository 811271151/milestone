import { Globe2, Monitor, Moon, Palette, Sun, Wallet } from 'lucide-react'
import type { Accent, Appearance, Language } from '../../domain/models'
import { CLIENT_ADDRESS, CONTRACTOR_ADDRESS, NETWORK } from '../../domain/models'
import { useWorkspace } from '../../state/context'
import { useI18n } from '../../i18n'
import { Badge, Choice, CopyAddress, InfoRow, PageHeading } from '../../ui/components'

export default function SettingsPage() {
  const { preferences, setPreferences, busy } = useWorkspace()
  const { t } = useI18n()
  return (
    <>
      <PageHeading
        eyebrow={t('workspace')}
        title={t('settings')}
        description={t('preferencesIntro')}
      />
      <div className="settings-grid grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="panel settings-panel">
          <section className="setting-section">
            <div className="setting-title">
              <Globe2 size={21} />
              <div>
                <h2>{t('language')}</h2>
                <p>{t('languageHint')}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['zh-CN', 'en-US'] as Language[]).map((language) => (
                <Choice
                  key={language}
                  selected={preferences.language === language}
                  onClick={() => setPreferences({ language })}
                >
                  <span className="language-symbol">{language === 'zh-CN' ? '中' : 'En'}</span>
                  <span>
                    {language === 'zh-CN' ? '简体中文' : 'English'}
                    <small>
                      {language === 'zh-CN' ? 'Chinese, Simplified' : 'English, United States'}
                    </small>
                  </span>
                </Choice>
              ))}
            </div>
          </section>
          <section className="setting-section">
            <div className="setting-title">
              <Sun size={21} />
              <div>
                <h2>{t('appearance')}</h2>
                <p>{t('appearanceHint')}</p>
              </div>
            </div>
            <div className="appearance-options grid gap-3 sm:grid-cols-3">
              {(
                [
                  { key: 'light', icon: Sun },
                  { key: 'dark', icon: Moon },
                  { key: 'system', icon: Monitor },
                ] as const
              ).map(({ key, icon: Icon }) => (
                <Choice
                  key={key}
                  selected={preferences.appearance === key}
                  onClick={() => setPreferences({ appearance: key as Appearance })}
                  icon={
                    <span className={`appearance-preview preview-${key}`} aria-hidden="true">
                      <span className="preview-sidebar">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="preview-content">
                        <i />
                        <span />
                        <span />
                      </span>
                      <Icon size={17} />
                    </span>
                  }
                >
                  <span>{t(key)}</span>
                </Choice>
              ))}
            </div>
          </section>
          <section className="setting-section">
            <div className="setting-title">
              <Palette size={21} />
              <div>
                <h2>{t('accent')}</h2>
                <p>{t('accentHint')}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['mint', 'ocean', 'amber', 'violet'] as Accent[]).map((accent) => (
                <Choice
                  key={accent}
                  selected={preferences.accent === accent}
                  onClick={() => setPreferences({ accent })}
                >
                  <span className={`color-swatch swatch-${accent}`} />
                  {t(accent)}
                </Choice>
              ))}
            </div>
          </section>
        </div>
        <aside>
          <div className="panel wallet-panel">
            <span className="release-icon">
              <Wallet size={24} />
            </span>
            <h2>{t('demoWallet')}</h2>
            <p className="muted text-sm leading-relaxed">{t('demoWalletHint')}</p>
            <div className="mt-5">
              <Badge status={preferences.connected ? 'connected' : 'disconnected'} />
            </div>
            <label className="field mt-5">
              <span>{t('demoRole')}</span>
              <select
                value={preferences.role}
                disabled={busy}
                onChange={(e) =>
                  setPreferences({ role: e.target.value as 'client' | 'contractor' })
                }
              >
                <option value="client">{t('client')}</option>
                <option value="contractor">{t('contractor')}</option>
              </select>
            </label>
            <span className="label-small mt-5 block">{t('address')}</span>
            <CopyAddress
              value={preferences.role === 'client' ? CLIENT_ADDRESS : CONTRACTOR_ADDRESS}
            />
            <button
              className="button button-secondary w-full mt-5"
              disabled={busy}
              onClick={() => setPreferences({ connected: !preferences.connected })}
            >
              {t(preferences.connected ? 'disconnect' : 'connectDemo')}
            </button>
            <InfoRow label={t('network')}>{NETWORK}</InfoRow>
            <p className="muted text-xs leading-relaxed">{t('networkHint')}</p>
          </div>
        </aside>
      </div>
    </>
  )
}
