import { ArrowLeft, Copy, MoreHorizontal, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Project } from '@/domain/models';
import { GlassCard, Screen, SectionTitle, StatusPill } from '@/ui/components';
import { useI18n } from '@/i18n';
import { MilestoneRow } from './MilestoneRow';
import { spacing, useTheme } from '@/ui/theme';

export function ProjectDetail({ project }: { project: Project }) {
  const { colors, accent } = useTheme();
  const { t } = useI18n();
  return <Screen><View style={[styles.container, { backgroundColor: colors.background }]}>
    <View style={styles.header}><Pressable onPress={() => router.back()} hitSlop={12}><ArrowLeft size={22} color={colors.text} /></Pressable><Text style={[styles.headerTitle, { color: colors.text }]}>{t('projectDetail')}</Text><MoreHorizontal size={22} color={colors.text} /></View>
    <View style={styles.hero}><View style={styles.heroTitleLine}><View style={{ flex: 1 }}><Text style={[styles.title, { color: colors.text }]}>{project.title}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{project.client} · {project.network}</Text></View><StatusPill label={project.status === 'review' ? t('review') : t('active')} tone={project.status === 'review' ? 'warning' : 'accent'} /></View><View style={styles.heroStats}><View><Text style={[styles.statLabel, { color: colors.muted }]}>{t('escrowBalance')}</Text><Text style={[styles.statValue, { color: colors.text }]}>{project.escrowAmount} <Text style={styles.statUnit}>{project.currency}</Text></Text></View><View><Text style={[styles.statLabel, { color: colors.muted }]}>{t('released')}</Text><Text style={[styles.statValue, { color: accent.strong }]}>{project.releasedAmount} <Text style={styles.statUnit}>{project.currency}</Text></Text></View></View><View style={styles.networkLine}><ShieldCheck size={14} color={accent.strong} /><Text style={[styles.networkText, { color: colors.muted }]}>{t('contractVerified')}</Text></View></View>
    <SectionTitle eyebrow={t('deliveryPlan')} title={t('milestones')} action={`${project.milestones.length} ${t('total')}`} />
    <GlassCard style={styles.milestoneCard}>{project.milestones.map((milestone) => <MilestoneRow key={milestone.id} milestone={milestone} onPress={milestone.status === 'review' ? () => router.push(`/project/${project.id}/submit` as never) : undefined} />)}</GlassCard>
    <View style={styles.footerRow}><Text style={[styles.address, { color: colors.faint }]}>{t('contract')} 0x8F3a...D14C</Text><Copy size={15} color={colors.faint} /></View>
  </View></Screen>;
}

const styles = StyleSheet.create({ container: { paddingBottom: spacing.md }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl }, headerTitle: { fontSize: 15, fontWeight: '700' }, hero: { marginBottom: spacing.xl }, heroTitleLine: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, title: { fontSize: 28, lineHeight: 33, fontWeight: '800', letterSpacing: -0.8 }, subtitle: { fontSize: 12, marginTop: 7 }, heroStats: { flexDirection: 'row', gap: 48, marginTop: spacing.xl }, statLabel: { fontSize: 11, marginBottom: 4 }, statValue: { fontSize: 22, fontWeight: '800' }, statUnit: { fontSize: 12, fontWeight: '700' }, networkLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg }, networkText: { fontSize: 11, flex: 1 }, milestoneCard: { paddingVertical: 0 }, footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg }, address: { fontSize: 11 },
});
