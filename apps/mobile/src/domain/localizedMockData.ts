import { AppLanguage, ChainTransaction, Project } from './models';

const projectCopy: Record<string, { title: string; client: string; milestones: Record<string, { title: string; description: string }> }> = {
  'atlas-mobile': {
    title: '\u0041\u0074\u006c\u0061\u0073 \u79fb\u52a8\u7aef\u91cd\u6784',
    client: '\u5317\u6781\u661f\u5de5\u4f5c\u5ba4',
    milestones: {
      'atlas-1': { title: '\u4ea7\u54c1\u57fa\u7840\u642d\u5efa', description: '\u4fe1\u606f\u67b6\u6784\u3001\u8bbe\u8ba1\u4ee4\u724c\u4e0e\u4ea4\u4ed8\u8bf4\u660e\u3002' },
      'atlas-2': { title: '\u79fb\u52a8\u7aef\u6838\u5fc3\u6d41\u7a0b', description: '\u9879\u76ee\u5217\u8868\u3001\u91cc\u7a0b\u7891\u8be6\u60c5\u548c\u94b1\u5305\u72b6\u6001\u3002' },
      'atlas-3': { title: '\u53d1\u5e03\u5019\u9009\u7248', description: '\u8d28\u91cf\u4fee\u590d\u3001\u6570\u636e\u4e8b\u4ef6\u548c\u4e0a\u7ebf\u68c0\u67e5\u6e05\u5355\u3002' },
      'atlas-4': { title: '\u4e0a\u7ebf\u4ea4\u63a5', description: '\u5e94\u7528\u5546\u5e97\u63d0\u4ea4\u7d20\u6750\u4e0e\u7ef4\u62a4\u8bf4\u660e\u3002' },
    },
  },
  'orbit-brand': {
    title: '\u004f\u0072\u0062\u0069\u0074 \u54c1\u724c\u4f53\u7cfb',
    client: '\u004f\u0072\u0062\u0069\u0074 \u5b9e\u9a8c\u5ba4',
    milestones: {
      'orbit-1': { title: '\u89c6\u89c9\u65b9\u5411', description: '\u54c1\u724c\u539f\u5219\u4e0e\u89c6\u89c9\u65b9\u6848\u63a2\u7d22\u3002' },
      'orbit-2': { title: '\u7ec4\u4ef6\u5e93', description: '\u53ef\u590d\u7528\u7684 Web \u4e0e\u79fb\u52a8\u7aef\u7ec4\u4ef6\u3002' },
      'orbit-3': { title: '\u6307\u5357\u4ea4\u4ed8', description: '\u6700\u7ec8\u54c1\u724c\u6307\u5357\u4e0e\u5bfc\u51fa\u8d44\u6e90\u5305\u3002' },
      'orbit-4': { title: '\u56e2\u961f\u542f\u7528', description: '\u56e2\u961f\u5de5\u4f5c\u574a\u4e0e\u843d\u5730\u68c0\u67e5\u8868\u3002' },
    },
  },
};

const transactionCopy: Record<string, { title: string; projectTitle: string }> = {
  'tx-901': { title: '\u91cc\u7a0b\u7891\u5df2\u91ca\u653e', projectTitle: '\u0041\u0074\u006c\u0061\u0073 \u79fb\u52a8\u7aef\u91cd\u6784' },
  'tx-900': { title: '\u5df2\u63d0\u4ea4\u5ba1\u6838', projectTitle: '\u004f\u0072\u0062\u0069\u0074 \u54c1\u724c\u4f53\u7cfb' },
  'tx-899': { title: '\u6258\u7ba1\u5df2\u5145\u503c', projectTitle: '\u0041\u0074\u006c\u0061\u0073 \u79fb\u52a8\u7aef\u91cd\u6784' },
};

export function localizeProject(project: Project, language: AppLanguage): Project {
  if (language === 'en-US') return project;
  const copy = projectCopy[project.id];
  if (!copy) return project;
  return {
    ...project,
    title: copy.title,
    client: copy.client,
    milestones: project.milestones.map((milestone) => ({
      ...milestone,
      ...(copy.milestones[milestone.id] ?? {}),
    })),
  };
}

export function localizeTransaction(transaction: ChainTransaction, language: AppLanguage): ChainTransaction {
  if (language === 'en-US') return transaction;
  const copy = transactionCopy[transaction.id];
  return copy ? { ...transaction, ...copy } : transaction;
}
