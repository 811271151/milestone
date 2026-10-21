import { useColorScheme } from 'react-native';

import { useAppPreferences } from '@/state/AppProvider';

const accents = {
  mint: { primary: '#54C8B0', soft: '#DFF7F1', strong: '#168C78' },
  sky: { primary: '#5A9DF2', soft: '#E5F0FF', strong: '#286BC2' },
  coral: { primary: '#F28B78', soft: '#FFE7E1', strong: '#C85B48' },
  violet: { primary: '#9678F2', soft: '#EEE8FF', strong: '#6746C9' },
} as const;

export function useTheme() {
  const systemScheme = useColorScheme();
  const { accent, appearance } = useAppPreferences();
  const dark = appearance === 'dark' || (appearance === 'system' && systemScheme === 'dark');
  const accentColor = accents[accent];

  return {
    dark,
    accent: accentColor,
    colors: {
      background: dark ? '#111615' : '#F4F8F7',
      surface: dark ? 'rgba(29, 38, 36, 0.88)' : 'rgba(255, 255, 255, 0.82)',
      surfaceSolid: dark ? '#1D2624' : '#FFFFFF',
      line: dark ? '#33413E' : '#DCE8E5',
      text: dark ? '#F2F8F6' : '#17221F',
      muted: dark ? '#A7B7B3' : '#73817D',
      faint: dark ? '#6A7A76' : '#9CAAA6',
      danger: '#D96B5B',
    },
  };
}

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30, xxl: 40 } as const;
