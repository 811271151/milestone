import { ArrowDownLeft, ArrowUpRight, Check, CircleHelp, Clock3, Coins, FileCheck2, FolderKanban, LockKeyhole, LucideIcon, Settings2, Sparkles, WalletCards } from 'lucide-react-native';

export const icons = { FolderKanban, Clock3, ArrowUpRight, Settings2, WalletCards, FileCheck2, Coins, LockKeyhole, Sparkles, CircleHelp, Check, ArrowDownLeft };
export type IconName = keyof typeof icons;
export const Icon = ({ name, ...props }: { name: IconName } & React.ComponentProps<LucideIcon>) => {
  const Component = icons[name];
  return <Component {...props} />;
};
