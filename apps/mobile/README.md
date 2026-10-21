# Milestone Mobile

Milestone 的 React Native 移动客户端，使用 Expo SDK 57、Expo Router 和 TypeScript。项目面向 iOS 与 Android，主要用于查看项目/里程碑、处理交付审核、查看演示交易记录和设置界面偏好。

## 当前实现范围

- **项目**：项目总览、托管金额与阶段进度展示、项目详情和里程碑列表。
- **待处理**：查看待审核的里程碑交付和演示证据。
- **交易**：查看本地演示交易状态、网络和交易摘要。
- **我的 / 设置**：选择简体中文或 English、浅色/深色/跟随系统外观及主题色；偏好通过 AsyncStorage 保存在本机。
- **链交互边界**：`src/services/chain/escrowGateway.ts` 定义后续接入钱包和合约的接口；当前实现是 mock gateway。

当前没有真实钱包连接、签名、RPC 查询、合约调用、服务端或数据库。页面中的钱包、余额、项目、证据和交易均为演示数据；App 和 `apps/web` 的数据互不共享。不能把界面显示的交易状态视为真实链上结果。产品范围与验收要求以 [`../../doc/mainline.md`](../../doc/mainline.md) 为准。

## 环境要求

- **Node.js 22.13.x 或更高版本**：Expo SDK 57 的最低 Node.js 版本为 22.13.x。Web 工程也建议使用相同版本，避免在仓库不同工程间切换 Node。
- **npm**：本工程提交了 `package-lock.json`，安装使用 `npm ci` 锁定依赖版本。
- **Expo Go**：真机快速测试需要在手机上安装与 Expo SDK 57 兼容的 Expo Go。
- Android 手机与电脑建议连接同一个 Wi-Fi。无法直连时可尝试 Expo Tunnel，详见下方网络说明。

本仓库根目录没有 `package.json`，不要在根目录执行 npm 安装命令。Mobile 与 Web 是独立工程，依赖需分别安装。

## 安装依赖

从仓库根目录进入 Mobile 工程：

```bash
cd apps/mobile
npm ci
```

若只下载了 `apps/mobile` 子目录，可直接在该目录运行 `npm ci`。首次安装会根据 `package-lock.json` 安装 Expo、React Native、导航、图标和存储等依赖。

添加依赖时，在 `apps/mobile` 目录使用 Expo 安装器，以匹配当前 SDK 的兼容版本：

```bash
npx expo install <package-name>
```

安装完成后提交 `package.json` 和 `package-lock.json` 的变更。不要手动将 Expo SDK 依赖升级到与当前 SDK 不兼容的版本；升级 SDK 时需按 Expo 的升级指南成组检查依赖。

## 启动与设备测试

在 `apps/mobile` 目录启动 Metro/Expo 开发服务器：

```bash
npm start
```

终端会显示二维码和连接地址。首次测试推荐使用 Expo Go：

- **Android 真机**：打开 Expo Go，使用应用内的扫码功能扫描终端二维码。若手机相机能识别二维码但无法打开 Expo Go，可在 Expo Go 内扫描。
- **iPhone 真机**：使用系统相机扫描并选择在 Expo Go 打开，或从 Expo Go 内扫描。
- **局域网连接失败**：停止当前服务，再运行 `npx expo start --tunnel`，等待 Tunnel ready 后用手机扫描新二维码。Tunnel 需要电脑和手机都能访问外网，首次建立可能较慢。
- **终端快捷键**：开发服务器运行时按 `r` 重新加载；按 `?` 查看当前 CLI 支持的快捷键。按 `Ctrl+C` 停止服务。

### 模拟器启动

```bash
npm run android
npm run ios
```

`npm run android` 会尝试打开已安装并启动的 Android 模拟器，需要 Android SDK / ADB 环境。只用 Android 真机 Expo Go 不必安装 Android Studio。

`npm run ios` 用于 iOS Simulator，需要 macOS 和 Xcode；Windows 不能运行 iOS Simulator。Windows 开发机可用 iPhone 真机上的 Expo Go 测试。

`npm run android`、`npm run ios` 是开发服务器的设备快捷启动命令，不会生成 APK、AAB 或 IPA。安装包构建属于后续 EAS Build 流程。

## 代码检查

在 `apps/mobile` 目录运行：

```bash
npm run lint
npx tsc --noEmit
npx expo-doctor
```

分别用于 ESLint、TypeScript 类型检查和 Expo 依赖/配置诊断。当前 Mobile 尚未配置 `npm test` 自动化测试脚本；提交前应运行以上检查，并在 iOS/Android 真机或模拟器走查主要页面和操作。

## 主要目录

```text
app/                    Expo Router 路由入口与页面映射
  (tabs)/               项目、待处理、交易、我的四个主导航页
  project/[id].tsx      项目详情路由
  project/[id]/submit   里程碑交付审核路由
src/domain/             领域模型、本地演示数据和本地化演示数据
src/features/           按项目、审核、交易、设置拆分的页面功能
src/i18n/               中英文界面文案
src/services/chain/     EscrowGateway 接口及 mock 实现
src/state/              应用偏好状态和 AsyncStorage 持久化
src/ui/                 主题 token、图标和可复用界面组件
assets/                 App 图标、启动图等静态资源
```

## 常见问题

- **扫码后提示 SDK / Expo Go 不兼容**：确认手机 Expo Go 已更新，并检查 `apps/mobile/package.json` 中的 Expo SDK 版本；不要通过降低某个单独依赖来绕过兼容提示。
- **Expo Go 看不到 Metro / 请求超时**：确认开发服务器仍在运行；手机与电脑连同一 Wi-Fi；关闭会隔离局域网的访客网络设置，或改用 `npx expo start --tunnel`。
- **二维码无法打开**：Android 使用 Expo Go 内的扫码入口；也可在 Expo Go 的开发服务器列表中选择本地服务。确保扫描的是本次启动终端重新生成的二维码和端口。
- **修改依赖后出现模块缺失或旧缓存**：先停止 Expo，再在 `apps/mobile` 运行 `npx expo start --clear`。如依赖安装不完整，重新运行 `npm ci`。
- **顶部状态栏或底部安全区异常**：先在对应 iOS/Android 实机复现，并记录设备型号、系统版本、屏幕录制或截图；安全区属于设备差异，不能只凭 Web 预览判断。

## Web 版本

本仓库的桌面 Web 是单独的 React + Vite 工程，位于 [`../web`](../web)，使用自己的依赖、开发服务器和测试命令。不要用 `npx expo start --web` 替代桌面 Web 开发。详细说明见 [`../web/README.md`](../web/README.md)。

Expo 工程的 Web 静态导出配置仅用于 Expo 项目自身的兼容/预览目标，不是 Cloudflare 上部署的桌面 Web 产品。
