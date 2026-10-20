# Milestone

Milestone 是一个面向独立开发者、设计师和小型工作室的链上项目托管与里程碑分账 App。

## 唯一产品主线

完整产品定义、业务边界、技术架构、合约规则、测试要求和 CR 核对清单见：

- [项目主线设计文档](doc/mainline.md)
- [UI 设计源文件](doc/ui-design.html)
- [UI 四屏总览图](doc/ui-design-overview.png)
- [UI 移动端预览图](doc/ui-design-mobile.png)
- [UI 设置中心图](doc/ui-design-settings.png)

后续产品设计、代码实现、测试和代码审查都以该文档为准。当前阶段只做 EVM 测试网和模拟代币，不处理真实资金，不发行平台代币，不做 DAO、交易市场或多链系统。

## 移动端工程

RN 客户端位于 [`apps/mobile`](apps/mobile)，使用 Expo Router + TypeScript。当前实现对应主线第二阶段：本地 mock 数据闭环、交易状态展示、主题/语言偏好持久化，以及可替换的 EVM escrow gateway 接口。

```bash
cd apps/mobile
npm install
npm run start
```

## 独立 Web 工程

桌面 Web 客户端位于 [`apps/web`](apps/web)，使用 React + TypeScript + Vite + Tailwind，使用左侧导航与桌面分栏布局，不依赖 Metro。先进入 Web 工程再启动：

```bash
cd apps/web
npm install
npm run dev
```

浏览器打开终端给出的地址（默认 `http://127.0.0.1:5173`）。Web 与手机 App 目前各自使用本地演示数据，不同步，不处理真实链上资金。功能边界和验收以 `doc/mainline.md` 第 23 节为准；开发与部署说明见 [`apps/web/README.md`](apps/web/README.md)。

