import { ArrowDownLeft, ArrowUpRight, Clock3, ExternalLink } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { transactions } from '@/domain/mockData';
import { localizeTransaction } from '@/domain/localizedMockData';
import { GlassCard, Screen, SectionTitle, StatusPill } from '@/ui/components';
import { useI18n } from '@/i18n';
import { spacing, useTheme } from '@/ui/theme';

export function TransactionList() {
  const { colors, accent } = useTheme();
  const { t, language } = useI18n();
  const localizedTransactions = transactions.map((transaction) => localizeTransaction(transaction, language));
  return <Screen><View style={[styles.container, { backgroundColor: colors.background }]}><SectionTitle eyebrow={t('onChainActivity')} title={t('transactions')} action={t('viewExplorer')} />{localizedTransactions.map((transaction) => { const isIncoming = transaction.type === 'fund'; const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight; return <GlassCard key={transaction.id} style={styles.card}><View style={styles.row}><View style={[styles.icon, { backgroundColor: transaction.status === 'pending' ? '#FFF2DB' : accent.soft }]}><Icon size={18} color={transaction.status === 'pending' ? '#B87825' : accent.strong} /></View><View style={{ flex: 1 }}><Text style={[styles.title, { color: colors.text }]}>{transaction.title}</Text><Text style={[styles.project, { color: colors.muted }]}>{transaction.projectTitle}</Text></View>{transaction.amount ? <Text style={[styles.amount, { color: colors.text }]}>{isIncoming ? '+' : '-'}{transaction.amount}</Text> : <Clock3 size={17} color="#B87825" />}</View><View style={styles.meta}><Text style={[styles.hash, { color: colors.faint }]}>{transaction.network} · {transaction.hash}</Text><StatusPill label={transaction.status === 'pending' ? t('pending') : t('confirmed')} tone={transaction.status === 'pending' ? 'warning' : 'success'} /></View><View style={styles.footer}><Text style={[styles.date, { color: colors.faint }]}>{transaction.createdAt}</Text><Pressable style={styles.explorer}><Text style={[styles.explorerText, { color: accent.strong }]}>{t('openExplorer')}</Text><ExternalLink size={13} color={accent.strong} /></Pressable></View></GlassCard>; })}</View></Screen>;
}

const styles = StyleSheet.create({ container: { paddingBottom: spacing.md }, card: { marginBottom: spacing.sm }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, icon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, title: { fontSize: 14, fontWeight: '700' }, project: { fontSize: 11, marginTop: 4 }, amount: { fontSize: 13, fontWeight: '800' }, meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, gap: spacing.sm }, hash: { fontSize: 10, flex: 1 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md }, date: { fontSize: 10 }, explorer: { flexDirection: 'row', alignItems: 'center', gap: 4 }, explorerText: { fontSize: 11, fontWeight: '700' },
});
