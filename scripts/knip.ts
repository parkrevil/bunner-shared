import { sharedPath, consumerRootFromInitCwd } from './paths';
import { runBin } from './run-bin';

const cwd = consumerRootFromInitCwd();
const args = process.argv.slice(2);

await runBin('knip', ['--config', sharedPath('knip.json'), ...args], { cwd });
