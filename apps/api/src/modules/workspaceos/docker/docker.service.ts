import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readTextFileSafe, writeTextFileSafe } from '@colanode/server/modules/workspaceos/lib/fs';
import { workspaceOSProjectsService } from '@colanode/server/modules/workspaceos/projects/projects.service';
import { type WorkspaceOSProject } from '@colanode/server/modules/workspaceos/projects/projects.types';
import { NotFoundError } from '@colanode/server/modules/workspaceos/shared/errors';
import {
  WORKSPACEOS_DOCKER_COMPOSE_FILE_NAME,
  WORKSPACEOS_DOCKER_TEMPLATE_FILE_NAME,
} from '@colanode/server/modules/workspaceos/shared/constants';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.resolve(moduleDir, '../../../../../templates');

class WorkspaceOSDockerService {
  private async resolveProject(projectId: string): Promise<WorkspaceOSProject> {
    const project = await workspaceOSProjectsService.getProject(projectId);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  private async resolveDockerTemplate(project: WorkspaceOSProject): Promise<string | null> {
    const templatePath = path.join(
      templatesRoot,
      project.templateSlug,
      WORKSPACEOS_DOCKER_TEMPLATE_FILE_NAME
    );

    try {
      await access(templatePath);
      return await readTextFileSafe(templatePath, '');
    } catch {
      return null;
    }
  }

  private interpolateTemplate(project: WorkspaceOSProject, template: string): string {
    return template
      .replaceAll('{{PROJECT_NAME}}', project.name)
      .replaceAll('{{PROJECT_SLUG}}', project.slug)
      .replaceAll('{{PORT}}', String(project.port));
  }

  private buildDefaultCompose(project: WorkspaceOSProject): string {
    return [
      'services:',
      '  app:',
      '    image: node:20-alpine',
      '    working_dir: /app',
      '    command: sh -c "npm install && npm run dev"',
      '    ports:',
      `      - "${project.port}:${project.port}"`,
      '    env_file:',
      '      - .env',
      '    volumes:',
      '      - ./:/app',
      '',
    ].join('\n');
  }

  async generateDockerCompose(projectId: string): Promise<{ filePath: string }> {
    const project = await this.resolveProject(projectId);
    const composePath = path.join(project.localPath, WORKSPACEOS_DOCKER_COMPOSE_FILE_NAME);
    const template = await this.resolveDockerTemplate(project);

    const composeContent = template
      ? this.interpolateTemplate(project, template)
      : this.buildDefaultCompose(project);

    await writeTextFileSafe(composePath, composeContent);

    return {
      filePath: composePath,
    };
  }
}

export const workspaceOSDockerService = new WorkspaceOSDockerService();
