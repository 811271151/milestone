import { ArrowUpRight, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Project } from '@/domain/models';
import { Avatar, GlassCard, StatusPill } from '@/ui/components';
import { useI18n } from '@/i18n';
import { spacing, useTheme } from '@/ui/theme';

export function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  const { colors, accent } = useTheme();
  const { t } = useI18n();
  const completed = project.milestones.filter((item) => item.status === 'completed').length;
  return <GlassCard style={styles.card} onPress={onPress}>
    <View style={styles.topRow}><View style={styles.projectIdentity}><Avatar label={project.title} color={project.color + '35'} /><View style={{ flex: 1 }}><Text style={[styles.projectTitle, { color: colors.text }]} numberOfLines={1}>{project.title}</Text><Text style={[styles.client, { color: colors.muted }]}>{project.client}</Text></View></View><Pressable onPress={onPress} hitSlop={10}><ArrowUpRight color={colors.faint} size={20} /></Pressable></View>
    <View style={styles.amountRow}><View><Text style={[styles.amount, { color: colors.text }]}>{project.escrowAmount}<Text style={[styles.currency, { color: colors.muted }]}> {project.currency}</Text></Text><Text style={[styles.caption, { color: colors.muted }]}>{t('escrowValue')} · {project.network}</Text></View><StatusPill label={project.status === 'review' ? t('needsReview') : t('active')} tone={project.status === 'review' ? 'warning' : 'accent'} /></View>
    <View style={styles.progressTrack}><View style={[styles.progressFill, { backgroundColor: accent.primary, width: `${project.completion * 100}%` }]} /></View>
    <View style={styles.bottomRow}><Text style={[styles.caption, { color: colors.muted }]}>{completed}/{project.milestones.length} {t('milestonesComplete')}</Text><View style={styles.detail}><Text style={[styles.caption, { color: colors.muted }]}>{project.updatedAt}</Text><ChevronRight size={15} color={colors.faint} /></View></View>
  </GlassCard>;
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm }, topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, projectIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }, projectTitle: { fontSize: 16, fontWeight: '700' }, client: { fontSize: 12, marginTop: 3 }, amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg }, amount: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }, currency: { fontSize: 13, fontWeight: '700' }, caption: { fontSize: 11, marginTop: 4 }, progressTrack: { height: 6, backgroundColor: 'rgba(130, 155, 150, 0.16)', borderRadius: 999, marginTop: spacing.md, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 999 }, bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm }, detail: { flexDirection: 'row', alignItems: 'center', gap: 1 },
});
