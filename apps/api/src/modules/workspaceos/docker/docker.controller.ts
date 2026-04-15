import { FastifyReply, FastifyRequest } from 'fastify';

import { workspaceOSDockerService } from '@colanode/server/modules/workspaceos/docker/docker.service';

export const workspaceOSDockerController = {
  async generate(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const output = await workspaceOSDockerService.generateDockerCompose(request.params.id);
      return reply.code(200).send(output);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate docker compose';
      const statusCode = message === 'Project not found' ? 404 : 400;
      return reply.code(statusCode).send({ message });
    }
  },
};
