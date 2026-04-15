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
import {
  workspaceOSErrorResponseSchema,
  workspaceOSSuccessResponseSchema,
} from '@colanode/server/modules/workspaceos/shared/responses';

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
        201: workspaceOSSuccessResponseSchema(workspaceOSProjectSchema),
        400: workspaceOSErrorResponseSchema,
        404: workspaceOSErrorResponseSchema,
      },
    },
    handler: workspaceOSProjectsController.create,
  });

  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: workspaceOSSuccessResponseSchema(workspaceOSProjectsListSchema),
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
        200: workspaceOSSuccessResponseSchema(workspaceOSProjectSchema),
        404: workspaceOSErrorResponseSchema,
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
        200: workspaceOSSuccessResponseSchema(workspaceOSProjectSchema),
        404: workspaceOSErrorResponseSchema,
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
        200: workspaceOSSuccessResponseSchema(workspaceOSProjectSchema),
        404: workspaceOSErrorResponseSchema,
      },
    },
    handler: workspaceOSProjectsController.remove,
  });

  done();
};
