import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { workspaceOSDockerController } from '@colanode/server/modules/workspaceos/docker/docker.controller';

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const responseSchema = z.object({
  filePath: z.string().trim().min(1),
});

const errorResponseSchema = z.object({
  message: z.string(),
});

export const workspaceOSDockerRoutes: FastifyPluginCallbackZod = (instance, _, done) => {
  instance.route({
    method: 'POST',
    url: '/:id/generate-docker',
    schema: {
      params: paramsSchema,
      response: {
        200: responseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: workspaceOSDockerController.generate,
  });

  done();
};
