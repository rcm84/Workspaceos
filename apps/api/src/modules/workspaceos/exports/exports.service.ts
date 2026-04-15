import { access } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { ensureDirectoryExists } from '@colanode/server/modules/workspaceos/lib/fs';
import { workspaceOSProjectsService } from '@colanode/server/modules/workspaceos/projects/projects.service';
import { type WorkspaceOSProject } from '@colanode/server/modules/workspaceos/projects/projects.types';
import { AppError, NotFoundError } from '@colanode/server/modules/workspaceos/shared/errors';
import {
  WORKSPACEOS_EXPORTS_DIRECTORY_NAME,
  WORKSPACEOS_STORAGE_DIRECTORY,
} from '@colanode/server/modules/workspaceos/shared/constants';

const execFileAsync = promisify(execFile);
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const exportsRoot = path.resolve(
  moduleDir,
  `../../../../${WORKSPACEOS_STORAGE_DIRECTORY}/${WORKSPACEOS_EXPORTS_DIRECTORY_NAME}`
);

class WorkspaceOSExportsService {
  private async resolveProject(projectId: string): Promise<WorkspaceOSProject> {
    const project = await workspaceOSProjectsService.getProject(projectId);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  private async ensureProjectDirectory(project: WorkspaceOSProject): Promise<void> {
    try {
      await access(project.localPath);
    } catch {
      throw new NotFoundError('Project directory not found');
    }
  }

  async exportProject(projectId: string): Promise<{ filePath: string; fileName: string }> {
    const project = await this.resolveProject(projectId);
    await this.ensureProjectDirectory(project);

    await ensureDirectoryExists(exportsRoot);

    const timestamp = new Date().toISOString().replaceAll(':', '-');
    const fileName = `${project.slug}-${timestamp}.zip`;
    const outputPath = path.join(exportsRoot, fileName);

    try {
      await execFileAsync(
        'zip',
        [
          '-r',
          '-q',
          outputPath,
          '.',
          '-x',
          '.git/*',
          '*/.git/*',
          'node_modules/*',
          '*/node_modules/*',
          'dist/*',
          '*/dist/*',
        ],
        { cwd: project.localPath }
      );
    } catch (error) {
      throw new AppError('Export failure: unable to create project archive', 400);
    }

    return {
      filePath: outputPath,
      fileName,
    };
  }
}

export const workspaceOSExportsService = new WorkspaceOSExportsService();
