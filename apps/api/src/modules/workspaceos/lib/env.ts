import path from 'node:path';

import { writeTextFileSafe } from '@colanode/server/modules/workspaceos/lib/fs';

export const generateEnvContent = (envValues: Record<string, string>): string => {
  return Object.entries(envValues)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
};

export const writeEnvFile = async (
  projectFolder: string,
  envValues: Record<string, string>
): Promise<void> => {
  const envContent = generateEnvContent(envValues);
  await writeTextFileSafe(path.join(projectFolder, '.env'), `${envContent}\n`);
};
