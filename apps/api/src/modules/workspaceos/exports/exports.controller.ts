import { FastifyReply, FastifyRequest } from 'fastify';

import { workspaceOSExportsService } from '@colanode/server/modules/workspaceos/exports/exports.service';
import { sendWorkspaceOSError } from '@colanode/server/modules/workspaceos/shared/errors';

export const workspaceOSExportsController = {
  async exportByProjectId(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const output = await workspaceOSExportsService.exportProject(request.params.id);
      return reply.code(200).send(output);
    } catch (error) {
      return sendWorkspaceOSError(reply, error, 'Unable to export project');
    }
  },
};
