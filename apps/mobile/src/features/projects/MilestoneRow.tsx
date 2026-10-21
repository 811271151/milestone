import { Check, ChevronRight, Clock3, LockKeyhole } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Milestone } from '@/domain/models';
import { StatusPill } from '@/ui/components';
import { useI18n } from '@/i18n';
import { spacing, useTheme } from '@/ui/theme';

export function MilestoneRow({ milestone, onPress }: { milestone: Milestone; onPress?: () => void }) {
  const { colors, accent } = useTheme();
  const { t } = useI18n();
  const isDone = milestone.status === 'completed';
  const isReview = milestone.status === 'review';
  const Icon = isDone ? Check : milestone.status === 'locked' ? LockKeyhole : Clock3;
  return <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: colors.line, opacity: pressed ? 0.7 : 1 }]}>
    <View style={[styles.statusIcon, { backgroundColor: isDone ? accent.soft : colors.background }]}><Icon size={16} color={isDone ? accent.strong : colors.faint} strokeWidth={2.6} /></View>
    <View style={styles.content}><View style={styles.titleLine}><Text style={[styles.title, { color: colors.text }]}>{milestone.title}</Text><Text style={[styles.amount, { color: colors.text }]}>{milestone.amount} USDC</Text></View><Text style={[styles.description, { color: colors.muted }]} numberOfLines={1}>{milestone.description}</Text><View style={styles.meta}><StatusPill label={isDone ? t('released') : isReview ? t('review') : milestone.status === 'locked' ? t('locked') : t('inProgress')} tone={isDone ? 'success' : isReview ? 'warning' : 'neutral'} /><Text style={[styles.due, { color: colors.faint }]}>{t('due')} {milestone.dueDate} · {milestone.evidenceCount} {t('evidence')}</Text></View></View>
    {onPress ? <ChevronRight size={18} color={colors.faint} /> : null}
  </Pressable>;
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth }, statusIcon: { width: 30, height: 30, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, content: { flex: 1 }, titleLine: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }, title: { fontSize: 14, fontWeight: '700', flex: 1 }, amount: { fontSize: 12, fontWeight: '700' }, description: { fontSize: 11, marginTop: 4 }, meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 8 }, due: { fontSize: 10 },
});
