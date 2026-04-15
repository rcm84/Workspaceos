import { FastifyReply, FastifyRequest } from 'fastify';

import { NotFoundError, sendWorkspaceOSError } from '@colanode/server/modules/workspaceos/shared/errors';
import { templatesService } from '@colanode/server/modules/workspaceos/templates/templates.service';

const toSuccessResponse = <T>(data: T) => ({
  success: true as const,
  data,
});

export const templatesController = {
  async list() {
    const templates = await templatesService.listTemplates();
    return toSuccessResponse(templates);
  },

  async getBySlug(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) {
    const template = await templatesService.getTemplate(request.params.slug);

    if (!template) {
      return sendWorkspaceOSError(
        reply,
        new NotFoundError(`Template not found: '${request.params.slug}'`),
        'Template not found'
      );
    }

    return toSuccessResponse(template);
  },
};
