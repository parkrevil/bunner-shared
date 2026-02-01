import { sharedPath, consumerRootFromInitCwd } from './paths';
import { runBin } from './run-bin';

const cwd = consumerRootFromInitCwd();

await runBin('lint-staged', ['--config', sharedPath('.lintstagedrc.json')], { cwd });
