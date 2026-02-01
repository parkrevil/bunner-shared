import { sharedPath, consumerRootFromInitCwd } from './paths';
import { runBin } from './run-bin';

const args = process.argv.slice(2);
const sepIndex = args.indexOf('--');
const passThrough = sepIndex === -1 ? args : args.slice(sepIndex + 1);

const cwd = consumerRootFromInitCwd();

await runBin('oxlint', ['--config', sharedPath('.oxlintrc.jsonc'), '--type-aware', '--fix', ...passThrough], { cwd });
