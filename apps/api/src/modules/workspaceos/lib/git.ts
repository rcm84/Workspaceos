import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { ensureDirectoryExists } from '@colanode/server/modules/workspaceos/lib/fs';

const execFileAsync = promisify(execFile);

export const cloneRepository = async (repoUrl: string, targetFolder: string): Promise<void> => {
  await ensureDirectoryExists(path.dirname(targetFolder));

  try {
    await execFileAsync('git', ['clone', '--depth', '1', repoUrl, targetFolder]);
  } catch (error) {
    const gitError = error as { stderr?: string; message?: string };
    const details = gitError.stderr?.trim() || gitError.message || 'Unknown git error';

    throw new Error(
      `Failed to clone repository '${repoUrl}' into '${targetFolder}': ${details}`,
      { cause: error }
    );
  }
};
