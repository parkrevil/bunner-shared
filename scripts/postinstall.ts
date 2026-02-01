import { consumerRootFromInitCwd } from './paths';

// Dependency postinstall runs during `bun install` in the consumer.
// Keep it safe: only touch husky if this is a git repo and the user didn't disable husky.
const cwd = consumerRootFromInitCwd();

if (process.env.HUSKY === '0') {
  process.exit(0);
}

// Skip in CI by default to avoid surprise git config changes.
if (process.env.CI === '1' || process.env.CI === 'true') {
  process.exit(0);
}

// Reuse the same logic as prepare.
await import('./prepare');
