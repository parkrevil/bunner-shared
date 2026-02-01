import { mkdir, writeFile, chmod, stat } from 'node:fs/promises';
import path from 'node:path';

import { consumerRootFromInitCwd } from './paths';
import { runBin } from './run-bin';

const cwd = consumerRootFromInitCwd();

const ensureFile = async (filePath: string, contents: string, mode?: number): Promise<void> => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, 'utf8');

  if (typeof mode === 'number') {
    await chmod(filePath, mode);
  }
};

const existsDir = async (dirPath: string): Promise<boolean> => {
  try {
    const info = await stat(dirPath);
    return info.isDirectory();
  } catch {
    return false;
  }
};

const huskyDir = path.join(cwd, '.husky');

// Only try to install husky if this looks like a git repo.
if (await existsDir(path.join(cwd, '.git'))) {
  // Equivalent to `husky install`.
  await runBin('husky', [], { cwd }, 'husky');
}

// Ensure hook shims exist (these call into bunner-shared/husky/*).
await ensureFile(
  path.join(huskyDir, 'pre-commit'),
  `#!/usr/bin/env sh\n. "$(dirname -- \"$0\")/_/husky.sh"\n\nsh ./node_modules/bunner-shared/husky/pre-commit "$@"\n`,
  0o755,
);

await ensureFile(
  path.join(huskyDir, 'commit-msg'),
  `#!/usr/bin/env sh\n. "$(dirname -- \"$0\")/_/husky.sh"\n\nsh ./node_modules/bunner-shared/husky/commit-msg "$@"\n`,
  0o755,
);

await ensureFile(
  path.join(huskyDir, 'pre-push'),
  `#!/usr/bin/env sh\n. "$(dirname -- \"$0\")/_/husky.sh"\n\nsh ./node_modules/bunner-shared/husky/pre-push "$@"\n`,
  0o755,
);
