import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createLogger } from '@colanode/server/lib/logger';
import {
  type CreateWorkspaceOSProjectInput,
  type UpdateWorkspaceOSProjectInput,
} from '@colanode/server/modules/workspaceos/projects/projects.schema';
import { workspaceOSProjectsStore } from '@colanode/server/modules/workspaceos/projects/projects.store';
import {
  type WorkspaceOSProject,
  type WorkspaceOSProjectStatus,
} from '@colanode/server/modules/workspaceos/projects/projects.types';
import { templatesService } from '@colanode/server/modules/workspaceos/templates/templates.service';

const logger = createLogger('workspaceos:projects-service');
const execFileAsync = promisify(execFile);

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(moduleDir, '../../../../workspace');

const toSlug = (value: string): string => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug.length > 0 ? slug : 'workspaceos-project';
};

const toEnvFileContent = (envJson: Record<string, string>): string => {
  return Object.entries(envJson)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
};

class WorkspaceOSProjectsService {
  private async cloneTemplateRepo(repoUrl: string, localPath: string): Promise<void> {
    await mkdir(workspaceRoot, { recursive: true });
    await execFileAsync('git', ['clone', repoUrl, localPath, '--depth', '1']);
  }

  private async writeProjectEnvFile(
    localPath: string,
    envJson: Record<string, string>
  ): Promise<void> {
    const envContent = toEnvFileContent(envJson);
    await writeFile(path.join(localPath, '.env'), `${envContent}\n`, 'utf-8');
  }

  private normalizeEnvValues(input: {
    databaseUrl: string;
    port: number;
    envJson: Record<string, string>;
  }): Record<string, string> {
    return {
      ...input.envJson,
      DATABASE_URL: input.databaseUrl,
      PORT: String(input.port),
    };
  }

  async listProjects(): Promise<WorkspaceOSProject[]> {
    const projects = await workspaceOSProjectsStore.readAll();
    return projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getProject(id: string): Promise<WorkspaceOSProject | null> {
    const projects = await this.listProjects();
    return projects.find((project) => project.id === id) ?? null;
  }

  async createProject(input: CreateWorkspaceOSProjectInput): Promise<WorkspaceOSProject> {
    const template = await templatesService.getTemplate(input.templateSlug);

    if (!template) {
      throw new Error(`Template '${input.templateSlug}' not found`);
    }

    const now = new Date().toISOString();
    const id = randomUUID();
    const slugBase = toSlug(input.name);
    const slug = `${slugBase}-${id.slice(0, 8)}`;
    const localPath = path.resolve(workspaceRoot, slug);
    const port = input.port ?? template.defaultPort;
    const envJson = this.normalizeEnvValues({
      databaseUrl: input.databaseUrl,
      port,
      envJson: input.envJson,
    });

    const project: WorkspaceOSProject = {
      id,
      name: input.name,
      slug,
      templateSlug: template.slug,
      status: 'PROVISIONING',
      localPath,
      port,
      databaseUrl: input.databaseUrl,
      envJson,
      createdAt: now,
      updatedAt: now,
    };

    const projects = await workspaceOSProjectsStore.readAll();
    projects.push(project);
    await workspaceOSProjectsStore.writeAll(projects);

    try {
      await this.cloneTemplateRepo(template.repoUrl, localPath);
      await this.writeProjectEnvFile(localPath, project.envJson);

      return this.setStatus(project.id, 'READY');
    } catch (error) {
      logger.error({ error, projectId: project.id }, 'WorkspaceOS project provisioning failed');
      return this.setStatus(project.id, 'ERROR');
    }
  }

  async updateProject(
    id: string,
    input: UpdateWorkspaceOSProjectInput
  ): Promise<WorkspaceOSProject | null> {
    const projects = await workspaceOSProjectsStore.readAll();
    const index = projects.findIndex((project) => project.id === id);

    if (index < 0) {
      return null;
    }

    const current = projects[index];
    const nextPort = input.port ?? current.port;
    const nextDatabaseUrl = input.databaseUrl ?? current.databaseUrl;
    const nextEnvJson = this.normalizeEnvValues({
      databaseUrl: nextDatabaseUrl,
      port: nextPort,
      envJson: input.envJson ? { ...input.envJson } : { ...current.envJson },
    });

    const next: WorkspaceOSProject = {
      ...current,
      ...input,
      port: nextPort,
      databaseUrl: nextDatabaseUrl,
      envJson: nextEnvJson,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = next;
    await workspaceOSProjectsStore.writeAll(projects);

    if (input.envJson || input.databaseUrl || input.port) {
      await this.writeProjectEnvFile(next.localPath, next.envJson);
    }

    return next;
  }

  async archiveProject(id: string): Promise<WorkspaceOSProject | null> {
    return this.setStatus(id, 'ARCHIVED');
  }

  private async setStatus(
    id: string,
    status: WorkspaceOSProjectStatus
  ): Promise<WorkspaceOSProject> {
    const projects = await workspaceOSProjectsStore.readAll();
    const index = projects.findIndex((project) => project.id === id);

    if (index < 0) {
      throw new Error(`Project '${id}' not found`);
    }

    const next: WorkspaceOSProject = {
      ...projects[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = next;
    await workspaceOSProjectsStore.writeAll(projects);
    return next;
  }
}

export const workspaceOSProjectsService = new WorkspaceOSProjectsService();
