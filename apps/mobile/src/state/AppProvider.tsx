import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { AccentKey, AppLanguage, Appearance } from '@/domain/models';

type AppPreferences = {
  language: AppLanguage;
  accent: AccentKey;
  appearance: Appearance;
};

type AppContextValue = AppPreferences & {
  hydrated: boolean;
  setLanguage: (language: AppLanguage) => void;
  setAccent: (accent: AccentKey) => void;
  setAppearance: (appearance: Appearance) => void;
};

const storageKey = '@milestone/preferences';
const defaultPreferences: AppPreferences = { language: 'en-US', accent: 'mint', appearance: 'light' };
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (value) setPreferences({ ...defaultPreferences, ...JSON.parse(value) });
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(storageKey, JSON.stringify(preferences)).catch(() => undefined);
  }, [hydrated, preferences]);

  const value = useMemo<AppContextValue>(() => ({
    ...preferences,
    hydrated,
    setLanguage: (language) => setPreferences((current) => ({ ...current, language })),
    setAccent: (accent) => setPreferences((current) => ({ ...current, accent })),
    setAppearance: (appearance) => setPreferences((current) => ({ ...current, appearance })),
  }), [hydrated, preferences]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppPreferences() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useAppPreferences must be used inside AppProvider');
  return value;
}
