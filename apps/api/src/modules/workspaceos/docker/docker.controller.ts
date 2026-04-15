import { FastifyReply, FastifyRequest } from 'fastify';

import { workspaceOSDockerService } from '@colanode/server/modules/workspaceos/docker/docker.service';
import { sendWorkspaceOSError } from '@colanode/server/modules/workspaceos/shared/errors';

const toSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data,
});

export const workspaceOSDockerController = {
  async generate(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const output = await workspaceOSDockerService.generateDockerCompose(request.params.id);
      return reply.code(200).send(toSuccessResponse(output));
    } catch (error) {
      return sendWorkspaceOSError(reply, error, 'Unable to generate docker compose');
    }
  },
};
