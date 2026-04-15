import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { workspaceOSExportsController } from '@colanode/server/modules/workspaceos/exports/exports.controller';
import {
  workspaceOSErrorResponseSchema,
  workspaceOSSuccessResponseSchema,
} from '@colanode/server/modules/workspaceos/shared/responses';

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const responseSchema = z.object({
  filePath: z.string().trim().min(1),
  fileName: z.string().trim().min(1),
});

export const workspaceOSExportsRoutes: FastifyPluginCallbackZod = (instance, _, done) => {
  instance.route({
    method: 'POST',
    url: '/:id/export',
    schema: {
      params: paramsSchema,
      response: {
        200: workspaceOSSuccessResponseSchema(responseSchema),
        400: workspaceOSErrorResponseSchema,
        404: workspaceOSErrorResponseSchema,
      },
    },
    handler: workspaceOSExportsController.exportByProjectId,
  });

  done();
};
