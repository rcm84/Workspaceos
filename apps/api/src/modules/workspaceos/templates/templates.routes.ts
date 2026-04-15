import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { templatesController } from '@colanode/server/modules/workspaceos/templates/templates.controller';
import {
  templateManifestSchema,
  templatesListResponseSchema,
} from '@colanode/server/modules/workspaceos/templates/templates.types';

const templateParamsSchema = z.object({
  slug: z.string().trim().min(1),
});

const templateNotFoundResponseSchema = z.object({
  message: z.string(),
});

export const workspaceOSTemplatesRoutes: FastifyPluginCallbackZod = (
  instance,
  _,
  done
) => {
  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: templatesListResponseSchema,
      },
    },
    handler: templatesController.list,
  });

  instance.route({
    method: 'GET',
    url: '/:slug',
    schema: {
      params: templateParamsSchema,
      response: {
        200: templateManifestSchema,
        404: templateNotFoundResponseSchema,
      },
    },
    handler: templatesController.getBySlug,
  });

  done();
};
