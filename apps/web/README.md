# Milestone Web

独立的桌面 Web 客户端，业务主线以 [`../../doc/mainline.md`](../../doc/mainline.md) 为准。React + TypeScript + Vite + Tailwind；不依赖 React Native、Expo 或 Metro。桌面采用左侧导航，窄屏采用抽屉导航。

## 启动

要求 Node.js 22.12+ 或受 Vite 支持的更高版本（当前机器 Node 24 可用）。

```bash
cd apps/web
npm install
npm run dev
```

打开终端显示的地址，默认 `http://127.0.0.1:5173/`。端口被占用时 Vite 会打印实际使用的端口。测试纯 Web 时不必启动 Metro；修改 Web 页面使用 Vite HMR。

```bash
npm run build    # TypeScript 检查与生产构建，产物在 dist/
npm run preview  # 本地预览生产产物
npm run lint     # Oxlint，警告也视为失败
npm run test     # Vitest：业务规则、存储与 DOM 页面交互
```

## 当前功能

- 项目工作台：托管余额与已释放金额、待审核交付、多列项目卡片、搜索和状态筛选。
- 项目草稿：创建、编辑、1–5 个里程碑、金额合计 / 地址 / 日期顺序校验。
- 详情与交付计划：按顺序解锁、交付说明与 HTTP(S) 证据链接、甲乙方地址。
- 待处理：交付审核、失败与中断交易的恢复入口。
- 模拟托管 / 释放：二次确认、等待签名、等待确认、确认与失败；确认前不改变资金状态；重复请求锁定。
- 交易记录：筛选、详情、状态与错误；不伪造链上哈希。
- 设置：简体中文 / English、浅色 / 深色 / 跟随系统、四种主题色、演示甲乙方角色和演示钱包开关。

先以甲方角色创建草稿并模拟托管，再切换乙方提交第一阶段，切回甲方审核释放。确认对话框可勾选“模拟失败”测试错误恢复。初始 Atlas、Orbit 示例沿用移动端业务场景；余额与进度改为按里程碑推导，固定使用 Ethereum Sepolia 演示。

## 代码边界

```text
src/
  app/          # 桌面外壳、侧栏、顶栏及路由集成测试
  features/     # projects、review、transactions、settings 页面
  domain/       # 数据模型、USDC 精度计算、状态迁移和输入校验
  services/     # 本地存储与可替换的 EscrowGateway
  state/        # 工作空间与偏好状态；统一处理业务操作和持久化
  i18n/         # 中英文资源与日期格式
  ui/           # 通用控件、原生 dialog、状态与金额展示
```

路由页面延迟加载。UI 不直接改变里程碑状态，业务前置校验与状态迁移位于 domain；模拟延迟和结果放在服务接口后。金额使用十进制字符串保存，使用 bigint 以 USDC 六位精度运算。

## 实现边界

这是本地演示系统：没有真实钱包身份验证、服务端、数据库、对象存储、合约连接或真实签名。数据仅存在当前浏览器，不会与移动端或其他浏览器同步。角色选择只是演示身份；后续真实角色必须由钱包地址与服务端 / 合约权限确定。不得把本地模拟确认当作真实链上确认。

刷新中断的模拟交易标记为失败；不会推断为成功。localStorage 损坏时使用示例恢复并显示警告。页面数据与偏好使用带版本的独立 key，不覆盖移动端数据。

## 部署

构建后部署 `dist/`。由于使用 BrowserRouter，托管服务必须把非静态资源的前端路由回退到 `index.html`。`public/_redirects` 提供 Cloudflare Pages / Netlify 常用的 SPA 回退规则；其他平台需配置等价规则。当前没有部署外部环境。

Cloudflare Workers 的 Git 集成使用仓库根目录执行以下命令（不是 `apps/web` 工作目录）：

```text
构建命令：npm --prefix apps/web ci && npm --prefix apps/web run build
部署命令：npx wrangler deploy --config apps/web/wrangler.jsonc
预览命令：npx wrangler preview --config apps/web/wrangler.jsonc
```

`wrangler.jsonc` 指定 Worker 名称 `milestone`、静态目录 `dist` 和 SPA 路由回退；控制台项目名称需与配置中的名称一致。预览命令用于分支预览部署，不是本地 `npm run preview` 服务。首次连接前先将配置提交并推送到 GitHub。此配置仅发布 Web，不构建或发布移动安装包。

## 验收范围

自动测试覆盖金额与状态约束、权限前置条件、防重复释放、失败重试、刷新中断、搜索导航、草稿创建、语言与主题持久化。DOM 测试不验证 CSS 尺寸、真实弹窗焦点或浏览器渲染；需另在真实浏览器验收 1920 / 1440 / 1024 / 768 / 390px、长文本、滚动、缩放、深色主题、键盘操作和刷新深链接。当前执行环境没有可连接的浏览器会话，尚未完成截图或真实浏览器视觉验收。
