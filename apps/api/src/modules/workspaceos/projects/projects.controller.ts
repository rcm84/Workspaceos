import { FastifyReply, FastifyRequest } from 'fastify';

import {
  type CreateWorkspaceOSProjectInput,
  type UpdateWorkspaceOSProjectInput,
} from '@colanode/server/modules/workspaceos/projects/projects.schema';
import { workspaceOSProjectsService } from '@colanode/server/modules/workspaceos/projects/projects.service';

export const workspaceOSProjectsController = {
  async create(
    request: FastifyRequest<{ Body: CreateWorkspaceOSProjectInput }>,
    reply: FastifyReply
  ) {
    try {
      const project = await workspaceOSProjectsService.createProject(request.body);
      return reply.code(201).send(project);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create project';
      return reply.code(400).send({ message });
    }
  },

  async list() {
    return workspaceOSProjectsService.listProjects();
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const project = await workspaceOSProjectsService.getProject(request.params.id);

    if (!project) {
      return reply.code(404).send({ message: 'Project not found' });
    }

    return project;
  },

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateWorkspaceOSProjectInput;
    }>,
    reply: FastifyReply
  ) {
    const project = await workspaceOSProjectsService.updateProject(
      request.params.id,
      request.body
    );

    if (!project) {
      return reply.code(404).send({ message: 'Project not found' });
    }

    return project;
  },

  async remove(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const project = await workspaceOSProjectsService.archiveProject(request.params.id);

    if (!project) {
      return reply.code(404).send({ message: 'Project not found' });
    }

    return project;
  },
};
