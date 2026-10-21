import { ArrowUpRight, FileCheck2, ImagePlus } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { projects } from '@/domain/mockData';
import { localizeProject } from '@/domain/localizedMockData';
import { GlassCard, Screen, SectionTitle, StatusPill } from '@/ui/components';
import { useI18n } from '@/i18n';
import { spacing, useTheme } from '@/ui/theme';

export function ReviewQueue() {
  const { colors, accent } = useTheme();
  const { t, language } = useI18n();
  const reviewItems = projects.flatMap((project) => { const localizedProject = localizeProject(project, language); return localizedProject.milestones.filter((milestone) => milestone.status === 'review').map((milestone) => ({ project: localizedProject, milestone })); });
  return <Screen><View style={[styles.container, { backgroundColor: colors.background }]}><SectionTitle eyebrow={t('pendingAttention')} title={t('pendingReview')} action={`${reviewItems.length} ${t('pendingItem')}`} /><Text style={[styles.intro, { color: colors.muted }]}>{t('pendingIntro')}</Text>{reviewItems.map(({ project, milestone }) => <GlassCard key={milestone.id} style={styles.card} onPress={() => router.push(`/project/${project.id}/submit` as never)}><View style={styles.row}><View style={[styles.icon, { backgroundColor: accent.soft }]}><FileCheck2 size={20} color={accent.strong} /></View><View style={{ flex: 1 }}><Text style={[styles.project, { color: colors.muted }]}>{project.title}</Text><Text style={[styles.title, { color: colors.text }]}>{milestone.title}</Text></View><ArrowUpRight size={20} color={colors.faint} /></View><View style={styles.evidence}><View style={styles.evidenceItem}><ImagePlus size={14} color={colors.muted} /><Text style={[styles.evidenceText, { color: colors.muted }]}>{milestone.evidenceCount} {t('attachments')}</Text></View><StatusPill label={`${milestone.amount} USDC`} tone="warning" /></View><Pressable style={[styles.reviewButton, { backgroundColor: accent.primary }]} onPress={() => router.push(`/project/${project.id}/submit` as never)}><Text style={styles.reviewButtonText}>{t('openReview')}</Text></Pressable></GlassCard>)}</View></Screen>;
}

const styles = StyleSheet.create({ container: { paddingBottom: spacing.md }, intro: { fontSize: 13, lineHeight: 20, marginBottom: spacing.lg, maxWidth: 340 }, card: { marginBottom: spacing.md }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, icon: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, project: { fontSize: 11, marginBottom: 4 }, title: { fontSize: 16, fontWeight: '700' }, evidence: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg }, evidenceItem: { flexDirection: 'row', alignItems: 'center', gap: 5 }, evidenceText: { fontSize: 11 }, reviewButton: { alignItems: 'center', borderRadius: 14, paddingVertical: 12, marginTop: spacing.md }, reviewButtonText: { color: '#08231E', fontSize: 13, fontWeight: '800' },
});
