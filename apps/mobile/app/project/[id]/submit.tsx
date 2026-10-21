import { ArrowLeft, Check, FileText, ImagePlus, ShieldCheck } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { projects } from '@/domain/mockData';
import { useI18n } from '@/i18n';
import { GlassCard, Screen, StatusPill } from '@/ui/components';
import { spacing, useTheme } from '@/ui/theme';

export default function SubmitRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, accent } = useTheme();
  const { t } = useI18n();
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const milestone = project.milestones.find((item) => item.status === 'review') ?? project.milestones[0];

  return <Screen><View style={[styles.container, { backgroundColor: colors.background }]}><View style={styles.header}><Pressable onPress={() => router.back()} hitSlop={12}><ArrowLeft size={22} color={colors.text} /></Pressable><Text style={[styles.headerTitle, { color: colors.text }]}>{t('reviewMilestone')}</Text><View style={{ width: 22 }} /></View><Text style={[styles.title, { color: colors.text }]}>{milestone.title}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{project.title} · {project.client}</Text><GlassCard style={styles.summary}><View style={styles.summaryRow}><Text style={[styles.label, { color: colors.muted }]}>{t('releaseAmount')}</Text><Text style={[styles.amount, { color: colors.text }]}>{milestone.amount} USDC</Text></View><View style={styles.summaryRow}><Text style={[styles.label, { color: colors.muted }]}>{t('network')}</Text><Text style={[styles.value, { color: colors.text }]}>{project.network}</Text></View><View style={styles.summaryRow}><Text style={[styles.label, { color: colors.muted }]}>{t('recipient')}</Text><Text style={[styles.value, { color: colors.text }]}>0x71C4...8A29</Text></View></GlassCard><Text style={[styles.sectionLabel, { color: colors.muted }]}>{t('submittedEvidence')}</Text><GlassCard style={styles.evidenceCard}><EvidenceFile icon="document" name="delivery-notes.pdf" meta={`1.8 MB · ${t('uploadedBy')}`} /><EvidenceFile icon="image" name="flow-preview.png" meta={`2.4 MB · ${t('uploadedBy')}`} /></GlassCard><View style={styles.notice}><ShieldCheck size={17} color={accent.strong} /><Text style={[styles.noticeText, { color: colors.muted }]}>{t('approvalNotice')}</Text></View><Pressable style={[styles.button, { backgroundColor: accent.primary }]} onPress={() => router.replace('/(tabs)/transactions' as never)}><Text style={styles.buttonText}>{t('approveRelease')} {milestone.amount} USDC</Text></Pressable><StatusPill label={t('duplicateApproval')} tone="neutral" /></View></Screen>;
}

function EvidenceFile({ icon, name, meta }: { icon: 'document' | 'image'; name: string; meta: string }) {
  const { colors, accent } = useTheme();
  return <View style={styles.fileRow}><View style={[styles.fileIcon, { backgroundColor: accent.soft }]}>{icon === 'document' ? <FileText size={18} color={accent.strong} /> : <ImagePlus size={18} color={accent.strong} />}</View><View style={{ flex: 1 }}><Text style={[styles.fileName, { color: colors.text }]}>{name}</Text><Text style={[styles.fileMeta, { color: colors.muted }]}>{meta}</Text></View><Check size={18} color={accent.strong} /></View>;
}

const styles = StyleSheet.create({ container: { paddingBottom: spacing.md }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl }, headerTitle: { fontSize: 15, fontWeight: '700' }, title: { fontSize: 28, lineHeight: 33, fontWeight: '800', letterSpacing: -0.8 }, subtitle: { fontSize: 12, marginTop: 7 }, summary: { marginTop: spacing.xl, gap: spacing.md }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }, label: { fontSize: 12 }, amount: { fontSize: 16, fontWeight: '800' }, value: { fontSize: 12, fontWeight: '700' }, sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: spacing.xl, marginBottom: spacing.sm, marginLeft: 4 }, evidenceCard: { paddingVertical: 4 }, fileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm }, fileIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 13 }, fileName: { fontSize: 13, fontWeight: '700' }, fileMeta: { fontSize: 10, marginTop: 3 }, notice: { flexDirection: 'row', gap: 7, marginTop: spacing.lg }, noticeText: { flex: 1, fontSize: 11, lineHeight: 17 }, button: { alignItems: 'center', borderRadius: 16, paddingVertical: 15, marginTop: spacing.xl, marginBottom: spacing.sm }, buttonText: { color: '#08231E', fontSize: 13, fontWeight: '800' },
});
