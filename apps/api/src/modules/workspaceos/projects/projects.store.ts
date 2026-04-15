import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  workspaceOSProjectsListSchema,
  type WorkspaceOSProject,
} from '@colanode/server/modules/workspaceos/projects/projects.types';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const storeFilePath = path.resolve(
  moduleDir,
  '../../../../storage/workspaceos-projects.json'
);

class WorkspaceOSProjectsStore {
  private writeLock = Promise.resolve();

  private async ensureStoreFile() {
    await mkdir(path.dirname(storeFilePath), { recursive: true });

    try {
      await readFile(storeFilePath, 'utf-8');
    } catch {
      await writeFile(storeFilePath, '[]\n', 'utf-8');
    }
  }

  async readAll(): Promise<WorkspaceOSProject[]> {
    await this.ensureStoreFile();
    const raw = await readFile(storeFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return workspaceOSProjectsListSchema.parse(parsed);
  }

  async writeAll(projects: WorkspaceOSProject[]): Promise<void> {
    await this.ensureStoreFile();

    this.writeLock = this.writeLock.then(async () => {
      const serialized = JSON.stringify(projects, null, 2);
      await writeFile(storeFilePath, `${serialized}\n`, 'utf-8');
    });

    return this.writeLock;
  }

  getStorePath() {
    return storeFilePath;
  }
}

export const workspaceOSProjectsStore = new WorkspaceOSProjectsStore();
