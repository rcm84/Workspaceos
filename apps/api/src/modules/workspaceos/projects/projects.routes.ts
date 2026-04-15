import { z } from 'zod/v4';
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { workspaceOSProjectsController } from '@colanode/server/modules/workspaceos/projects/projects.controller';
import {
  createWorkspaceOSProjectSchema,
  updateWorkspaceOSProjectSchema,
  workspaceOSProjectParamsSchema,
} from '@colanode/server/modules/workspaceos/projects/projects.schema';
import {
  workspaceOSProjectSchema,
  workspaceOSProjectsListSchema,
} from '@colanode/server/modules/workspaceos/projects/projects.types';

const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
  }),
});

export const workspaceOSProjectsRoutes: FastifyPluginCallbackZod = (
  instance,
  _,
  done
) => {
  instance.route({
    method: 'POST',
    url: '/',
    schema: {
      body: createWorkspaceOSProjectSchema,
      response: {
        201: workspaceOSProjectSchema,
        400: errorResponseSchema,
      },
    },
    handler: workspaceOSProjectsController.create,
  });

  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: workspaceOSProjectsListSchema,
      },
    },
    handler: workspaceOSProjectsController.list,
  });

  instance.route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: workspaceOSProjectParamsSchema,
      response: {
        200: workspaceOSProjectSchema,
        404: errorResponseSchema,
      },
    },
    handler: workspaceOSProjectsController.getById,
  });

  instance.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: workspaceOSProjectParamsSchema,
      body: updateWorkspaceOSProjectSchema,
      response: {
        200: workspaceOSProjectSchema,
        404: errorResponseSchema,
      },
    },
    handler: workspaceOSProjectsController.update,
  });

  instance.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: workspaceOSProjectParamsSchema,
      response: {
        200: workspaceOSProjectSchema,
        404: errorResponseSchema,
      },
    },
    handler: workspaceOSProjectsController.remove,
  });

  done();
};
