import { sharedPath, consumerRootFromInitCwd } from './paths';
import { runBin } from './run-bin';

const cwd = consumerRootFromInitCwd();
const args = process.argv.slice(2);

await runBin('@commitlint/cli', ['--config', sharedPath('commitlint.config.cjs'), ...args], { cwd }, 'commitlint');
