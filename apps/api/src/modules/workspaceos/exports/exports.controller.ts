import { FastifyReply, FastifyRequest } from 'fastify';

import { workspaceOSExportsService } from '@colanode/server/modules/workspaceos/exports/exports.service';
import { sendWorkspaceOSError } from '@colanode/server/modules/workspaceos/shared/errors';

const toSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data,
});

export const workspaceOSExportsController = {
  async exportByProjectId(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const output = await workspaceOSExportsService.exportProject(request.params.id);
      return reply.code(200).send(toSuccessResponse(output));
    } catch (error) {
      return sendWorkspaceOSError(reply, error, 'Unable to export project');
    }
  },
};
