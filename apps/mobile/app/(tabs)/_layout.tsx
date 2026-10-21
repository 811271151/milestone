import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@/ui/icons';
import { useTheme } from '@/ui/theme';
import { useI18n } from '@/i18n';

const tabIcons: Record<string, IconName> = { index: 'FolderKanban', pending: 'Clock3', transactions: 'ArrowUpRight', me: 'Settings2' };

export default function TabLayout() {
  const { colors, accent } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: accent.strong, tabBarInactiveTintColor: colors.faint, tabBarStyle: [styles.tabBar, { backgroundColor: colors.surfaceSolid, borderTopColor: colors.line, height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom }], tabBarLabelStyle: styles.label, tabBarIcon: ({ color, size }) => <Icon name={tabIcons[route.name] ?? 'FolderKanban'} size={size} color={color} strokeWidth={2.2} /> })}><Tabs.Screen name="index" options={{ title: t('navProjects') }} /><Tabs.Screen name="pending" options={{ title: t('navPending') }} /><Tabs.Screen name="transactions" options={{ title: t('navTransactions') }} /><Tabs.Screen name="me" options={{ title: t('navMe') }} /></Tabs>;
}

const styles = StyleSheet.create({ tabBar: { paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, elevation: 0 }, label: { fontSize: 10, fontWeight: '700' },
});
