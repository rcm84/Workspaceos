import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ensureDirectoryExists,
  readJsonFileSafe,
  readTextFileSafe,
  writeJsonFileSafe,
} from '@colanode/server/modules/workspaceos/lib/fs';
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
    await ensureDirectoryExists(path.dirname(storeFilePath));
    const existing = await readTextFileSafe(storeFilePath, '');

    if (existing.trim().length === 0) {
      await writeJsonFileSafe(storeFilePath, []);
    }
  }

  async readAll(): Promise<WorkspaceOSProject[]> {
    await this.ensureStoreFile();
    const parsed = await readJsonFileSafe<unknown>(storeFilePath, []);
    return workspaceOSProjectsListSchema.parse(parsed);
  }

  async writeAll(projects: WorkspaceOSProject[]): Promise<void> {
    await this.ensureStoreFile();

    this.writeLock = this.writeLock.then(async () => {
      await writeJsonFileSafe(storeFilePath, projects);
    });

    return this.writeLock;
  }

  getStorePath() {
    return storeFilePath;
  }
}

export const workspaceOSProjectsStore = new WorkspaceOSProjectsStore();
