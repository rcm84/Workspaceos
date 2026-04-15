import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { workspaceOSExportsController } from '@colanode/server/modules/workspaceos/exports/exports.controller';

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const responseSchema = z.object({
  filePath: z.string().trim().min(1),
  fileName: z.string().trim().min(1),
});

const errorResponseSchema = z.object({
  message: z.string(),
});

export const workspaceOSExportsRoutes: FastifyPluginCallbackZod = (instance, _, done) => {
  instance.route({
    method: 'POST',
    url: '/:id/export',
    schema: {
      params: paramsSchema,
      response: {
        200: responseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: workspaceOSExportsController.exportByProjectId,
  });

  done();
};
