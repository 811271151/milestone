import { BlurView } from 'expo-blur';
import { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, IconName } from './icons';
import { spacing, useTheme } from './theme';

export function Screen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const { colors } = useTheme();
  if (!scroll) return <SafeAreaView edges={['top', 'bottom']} style={[styles.screen, { backgroundColor: colors.background }]}>{children}</SafeAreaView>;
  return <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}><ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"><View style={styles.screenContent}>{children}</View></ScrollView></SafeAreaView>;
}

export function GlassCard({ children, style, onPress }: PropsWithChildren<{ style?: ViewStyle; onPress?: () => void }>) {
  const { colors, dark } = useTheme();
  const card = <BlurView intensity={dark ? 28 : 48} tint={dark ? 'dark' : 'light'} style={[styles.card, { borderColor: colors.line, backgroundColor: colors.surface }, style]}>{children}</BlurView>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}>{card}</Pressable> : card;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  const { colors, accent } = useTheme();
  return <View style={styles.sectionTitle}><View><Text style={[styles.eyebrow, { color: colors.muted }]}>{eyebrow?.toUpperCase()}</Text><Text style={[styles.sectionHeading, { color: colors.text }]}>{title}</Text></View>{action ? <Text style={[styles.action, { color: accent.strong }]}>{action}</Text> : null}</View>;
}

export function StatusPill({ label, tone = 'neutral', icon }: { label: string; tone?: 'accent' | 'warning' | 'success' | 'neutral'; icon?: IconName }) {
  const { colors, accent } = useTheme();
  const color = tone === 'accent' || tone === 'success' ? accent.strong : tone === 'warning' ? '#B87825' : colors.muted;
  const background = tone === 'accent' || tone === 'success' ? accent.soft : tone === 'warning' ? '#FFF2DB' : colors.background;
  return <View style={[styles.pill, { backgroundColor: background }]}>{icon ? <Icon name={icon} size={13} color={color} strokeWidth={2.4} /> : null}<Text style={[styles.pillText, { color }]}>{label}</Text></View>;
}

export function Avatar({ label, color }: { label: string; color?: string }) {
  const { accent } = useTheme();
  return <View style={[styles.avatar, { backgroundColor: color ?? accent.soft }]}><Text style={[styles.avatarText, { color: accent.strong }]}>{label.slice(0, 2).toUpperCase()}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  screenContent: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: 110 },
  scrollContent: { flexGrow: 1 },
  card: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderRadius: 24, padding: spacing.md },
  sectionTitle: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: spacing.sm },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  sectionHeading: { fontSize: 22, fontWeight: '700', letterSpacing: 0 },
  action: { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 6 },
  pillText: { fontSize: 11, fontWeight: '700' },
  avatar: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  avatarText: { fontSize: 12, fontWeight: '800' },
});
