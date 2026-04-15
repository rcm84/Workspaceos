import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { templatesController } from '@colanode/server/modules/workspaceos/templates/templates.controller';
import {
  templateManifestSchema,
  templatesListResponseSchema,
} from '@colanode/server/modules/workspaceos/templates/templates.types';
import {
  workspaceOSErrorResponseSchema,
  workspaceOSSuccessResponseSchema,
} from '@colanode/server/modules/workspaceos/shared/responses';

const templateParamsSchema = z.object({
  slug: z.string().trim().min(1),
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
        200: workspaceOSSuccessResponseSchema(templatesListResponseSchema),
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
        200: workspaceOSSuccessResponseSchema(templateManifestSchema),
        404: workspaceOSErrorResponseSchema,
      },
    },
    handler: templatesController.getBySlug,
  });

  done();
};
