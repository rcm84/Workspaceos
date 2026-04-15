import { FastifyPluginCallback } from 'fastify';

import { clientRoutes } from '@colanode/server/api/client/routes';
import { configGetRoute } from '@colanode/server/api/config';
import { homeRoute } from '@colanode/server/api/home';
import { config } from '@colanode/server/lib/config';
import { workspaceOSDockerRoutes } from '@colanode/server/modules/workspaceos/docker/docker.routes';
import { workspaceOSExportsRoutes } from '@colanode/server/modules/workspaceos/exports/exports.routes';
import { workspaceOSProjectsRoutes } from '@colanode/server/modules/workspaceos/projects/projects.routes';
import { workspaceOSTemplatesRoutes } from '@colanode/server/modules/workspaceos/templates/templates.routes';

const workspaceOSRoutes: FastifyPluginCallback = (instance, _, done) => {
  instance.register(workspaceOSTemplatesRoutes, {
    prefix: '/templates',
  });
  instance.register(workspaceOSProjectsRoutes, {
    prefix: '/projects',
  });
  instance.register(workspaceOSDockerRoutes, {
    prefix: '/projects',
  });
  instance.register(workspaceOSExportsRoutes, {
    prefix: '/projects',
  });

  done();
};

export const apiRoutes: FastifyPluginCallback = (instance, _, done) => {
  const prefix = config.pathPrefix ? `/${config.pathPrefix}` : '';

  instance.register(homeRoute, { prefix });
  instance.register(configGetRoute, { prefix });
  instance.register(clientRoutes, { prefix: `${prefix}/client/v1` });
  instance.register(workspaceOSRoutes, {
    prefix: `${prefix}/api/workspaceos`,
  });

  done();
};
