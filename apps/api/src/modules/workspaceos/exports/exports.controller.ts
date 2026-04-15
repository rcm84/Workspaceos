import { FastifyReply, FastifyRequest } from 'fastify';

import { workspaceOSExportsService } from '@colanode/server/modules/workspaceos/exports/exports.service';

export const workspaceOSExportsController = {
  async exportByProjectId(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const output = await workspaceOSExportsService.exportProject(request.params.id);
      return reply.code(200).send(output);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to export project';
      const statusCode = message === 'Project not found' ? 404 : 400;
      return reply.code(statusCode).send({ message });
    }
  },
};
