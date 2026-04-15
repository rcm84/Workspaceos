import { FastifyReply, FastifyRequest } from 'fastify';

import {
  type CreateWorkspaceOSProjectInput,
  type UpdateWorkspaceOSProjectInput,
} from '@colanode/server/modules/workspaceos/projects/projects.schema';
import { workspaceOSProjectsService } from '@colanode/server/modules/workspaceos/projects/projects.service';
import {
  NotFoundError,
  sendWorkspaceOSError,
} from '@colanode/server/modules/workspaceos/shared/errors';

const toSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data,
});

export const workspaceOSProjectsController = {
  async create(
    request: FastifyRequest<{ Body: CreateWorkspaceOSProjectInput }>,
    reply: FastifyReply
  ) {
    try {
      const project = await workspaceOSProjectsService.createProject(request.body);
      return reply.code(201).send(toSuccessResponse(project));
    } catch (error) {
      return sendWorkspaceOSError(reply, error, 'Unable to create project');
    }
  },

  async list() {
    const projects = await workspaceOSProjectsService.listProjects();
    return toSuccessResponse(projects);
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const project = await workspaceOSProjectsService.getProject(request.params.id);

    if (!project) {
      return sendWorkspaceOSError(reply, new NotFoundError('Project not found'), 'Project not found');
    }

    return toSuccessResponse(project);
  },

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateWorkspaceOSProjectInput;
    }>,
    reply: FastifyReply
  ) {
    try {
      const project = await workspaceOSProjectsService.updateProject(
        request.params.id,
        request.body
      );

      if (!project) {
        return sendWorkspaceOSError(
          reply,
          new NotFoundError('Project not found'),
          'Project not found'
        );
      }

      return toSuccessResponse(project);
    } catch (error) {
      return sendWorkspaceOSError(reply, error, 'Unable to update project');
    }
  },

  async remove(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const project = await workspaceOSProjectsService.archiveProject(request.params.id);

      if (!project) {
        return sendWorkspaceOSError(
          reply,
          new NotFoundError('Project not found'),
          'Project not found'
        );
      }

      return toSuccessResponse(project);
    } catch (error) {
      return sendWorkspaceOSError(reply, error, 'Unable to archive project');
    }
  },
};
