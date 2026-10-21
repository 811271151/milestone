# Milestone

Milestone 是一个面向独立开发者、设计师和小型工作室的链上项目托管与里程碑分账产品，包含独立的 React Native 移动端和 React Web 端。

## 项目文档

- [项目主线设计文档](doc/mainline.md)
- [UI 设计源文件](doc/ui-design.html)
- [UI 四屏总览图](doc/ui-design-overview.png)
- [UI 移动端预览图](doc/ui-design-mobile.png)
- [UI 设置中心图](doc/ui-design-settings.png)

产品设计、业务边界、测试要求和 CR 核对均以项目主线文档为准。当前版本以本地演示数据和 EVM 测试网流程为目标，不处理真实资金。

## 环境要求

- Node.js 22.12 或更高版本。Web 使用 Vite 8；保持 Node 版本一致可避免依赖和构建问题。
- npm（两个子项目都提交了 `package-lock.json`）。
- 移动端真机测试需安装 Expo Go；Android 与电脑建议连接同一 Wi-Fi。

本仓库没有根目录 `package.json`，Mobile 和 Web 是独立工程，需要分别安装依赖。

## Mobile（Expo / React Native）

移动端工程位于 [`apps/mobile`](apps/mobile)，使用 Expo Router + TypeScript。

### 安装依赖并启动

在仓库根目录执行：

```bash
cd apps/mobile
npm ci
npm start
```

终端显示二维码后：

- **Android 真机**：打开 Expo Go，在 Expo Go 中扫描终端二维码。若扫描不到或连接超时，确认手机和电脑在同一 Wi-Fi；也可停止服务后运行 `npx expo start --tunnel`，再扫描新二维码。Android 相机识别不了时，使用 Expo Go 自带的扫码入口。
- **iPhone 真机**：用相机扫描二维码并选择在 Expo Go 中打开；也可从 Expo Go 扫描。若局域网连接失败，同样可使用 `npx expo start --tunnel`。
- **Android 模拟器**：运行 `npm run android`。需要预先配置 Android SDK 和已启动的模拟器；只测试真机 Expo Go 时不需要 Android Studio。
- **iOS 模拟器**：运行 `npm run ios`。需要 macOS 和 Xcode；Windows 不能运行 iOS Simulator，可使用 iPhone 真机上的 Expo Go 测试。

Expo Go 与项目使用的 Expo SDK 版本需要兼容。扫描后若提示 Expo Go 版本不兼容，先更新 Expo Go，再重新启动开发服务。

### Mobile 检查命令

在 `apps/mobile` 目录运行：

```bash
npm run lint       # Expo ESLint
npx tsc --noEmit   # TypeScript 类型检查
npx expo-doctor    # Expo 依赖和配置诊断
```

当前 Mobile 未配置自动化 `npm test` 脚本；移动端主要通过 Expo Go 在 iOS / Android 实机检查界面、导航和交互。

## Web（React + Vite + Tailwind）

桌面 Web 位于 [`apps/web`](apps/web)，独立于 Expo，不启动 Metro。

```bash
cd apps/web
npm ci
npm run dev
```

打开终端显示的本地地址，默认 `http://127.0.0.1:5173/`。常用检查命令：

```bash
npm run test       # Vitest 自动化测试
npm run lint       # Oxlint
npm run build      # TypeScript 检查并生成生产构建
npm run preview    # 本地预览 dist 生产构建
```

Cloudflare Workers 的 Git 集成构建和部署命令见 [`apps/web/README.md`](apps/web/README.md)。Web 部署不会构建或发布 iOS / Android 安装包。

## 当前数据边界

Web 和 Mobile 各自使用本地演示数据，不会相互同步；当前没有真实钱包身份验证、服务端数据库或已接入的真实托管合约。开发、验收和后续迭代请遵守 [项目主线设计文档](doc/mainline.md) 中的范围与安全要求。
