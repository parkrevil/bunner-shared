import path from 'node:path';

export const SHARED_ROOT = new URL('..', import.meta.url).pathname;

export const sharedPath = (...segments: string[]): string => path.join(SHARED_ROOT, ...segments);

export const consumerRootFromInitCwd = (): string => {
  const initCwd = process.env.INIT_CWD;
  return typeof initCwd === 'string' && initCwd.length > 0 ? initCwd : process.cwd();
};
