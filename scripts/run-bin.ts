import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface RunBinOptions {
  cwd: string;
  env?: Record<string, string | undefined>;
}

const PACKAGE_ROOT = new URL('..', import.meta.url).pathname;

const isJsEntrypoint = (value: string): boolean => /\.(c?m?js)$/.test(value);

const resolvePackageJson = (pkgName: string): string => Bun.resolveSync(`${pkgName}/package.json`, PACKAGE_ROOT);

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T;

const resolveBinEntry = async (pkgName: string, binName?: string): Promise<string> => {
  const pkgJsonPath = resolvePackageJson(pkgName);
  const pkgDir = path.dirname(pkgJsonPath);
  const pkg = await readJson<{ bin?: string | Record<string, string> }>(pkgJsonPath);

  const bin = pkg.bin;
  if (typeof bin === 'string') {
    return path.join(pkgDir, bin);
  }

  if (bin && typeof bin === 'object') {
    const candidate = typeof binName === 'string' ? bin[binName] : Object.values(bin)[0];

    if (typeof candidate === 'string' && candidate.length > 0) {
      return path.join(pkgDir, candidate);
    }
  }

  throw new Error(`Cannot resolve bin for ${pkgName}${binName ? ` (${binName})` : ''}`);
};

export const runBin = async (
  pkgName: string,
  args: readonly string[],
  options: RunBinOptions,
  binName?: string,
): Promise<void> => {
  const entry = await resolveBinEntry(pkgName, binName);

  const isJs = isJsEntrypoint(entry);
  const cmd = isJs ? 'bun' : entry;
  const fullArgs = isJs ? [entry, ...args] : args;

  const child = Bun.spawnSync([cmd, ...fullArgs], {
    cwd: options.cwd,
    env: {
      ...Bun.env,
      ...(options.env ?? {}),
    },
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const code = typeof child.exitCode === 'number' ? child.exitCode : 1;
  if (code !== 0) {
    process.exit(code);
  }
};
