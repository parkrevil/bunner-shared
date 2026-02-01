import { consumerRootFromInitCwd } from './paths';
import { runBin } from './run-bin';

const cwd = consumerRootFromInitCwd();
const args = process.argv.slice(2);
const sepIndex = args.indexOf('--');
const passThrough = sepIndex === -1 ? args : args.slice(sepIndex + 1);

await runBin('typescript', passThrough.length > 0 ? passThrough : ['--noEmit'], { cwd }, 'tsc');
