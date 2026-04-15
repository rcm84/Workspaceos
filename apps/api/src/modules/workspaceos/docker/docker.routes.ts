import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { workspaceOSDockerController } from '@colanode/server/modules/workspaceos/docker/docker.controller';
import {
  workspaceOSErrorResponseSchema,
  workspaceOSSuccessResponseSchema,
} from '@colanode/server/modules/workspaceos/shared/responses';

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const responseSchema = z.object({
  filePath: z.string().trim().min(1),
});

export const workspaceOSDockerRoutes: FastifyPluginCallbackZod = (instance, _, done) => {
  instance.route({
    method: 'POST',
    url: '/:id/generate-docker',
    schema: {
      params: paramsSchema,
      response: {
        200: workspaceOSSuccessResponseSchema(responseSchema),
        400: workspaceOSErrorResponseSchema,
        404: workspaceOSErrorResponseSchema,
      },
    },
    handler: workspaceOSDockerController.generate,
  });

  done();
};
