import { FastifyReply, FastifyRequest } from 'fastify';

import { templatesService } from '@colanode/server/modules/workspaceos/templates/templates.service';

export const templatesController = {
  async list() {
    return templatesService.listTemplates();
  },

  async getBySlug(
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) {
    const template = await templatesService.getTemplate(request.params.slug);

    if (!template) {
      return reply.code(404).send({
        message: `Template '${request.params.slug}' not found`,
      });
    }

    return template;
  },
};
