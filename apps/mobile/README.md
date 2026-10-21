# Milestone mobile

Expo Router + TypeScript mobile client for the Milestone escrow workflow.

## Current scope

- Local mock data for projects, milestones, evidence and transactions.
- Four product surfaces: Projects, Pending, Transactions and Me.
- Project detail and milestone review flows are connected with Expo Router.
- Theme, language and accent preferences persist with AsyncStorage.
- `src/services/chain/escrowGateway.ts` is the boundary for the future EVM wallet and escrow contract adapter.

## Run

```bash
npm install
npm run start
```

For a browser build:

```bash
npx expo export --platform web
```

Web is configured as a static preview target. The mobile build remains the product target; static output avoids starting Expo Router's server-side renderer during local development on Windows.

## Structure

```text
app/                 Expo Router screens only
src/domain/          Business models and mock fixtures
src/features/        UI modules grouped by product capability
src/services/chain/  Wallet and contract ports/adapters
src/state/           Cross-screen preferences and persistence
src/ui/              Tokens, icons and reusable visual primitives
```
