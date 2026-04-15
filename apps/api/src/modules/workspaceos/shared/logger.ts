import { createLogger } from '@colanode/server/lib/logger';

type LogContext = Record<string, unknown> | undefined;

const WORKSPACEOS_LOGGER_NAMESPACE = 'workspaceos';

export const createWorkspaceOSLogger = (scope: string) => {
  const logger = createLogger(`${WORKSPACEOS_LOGGER_NAMESPACE}:${scope}`);

  return {
    info(message: string, context?: LogContext) {
      if (context) {
        logger.info(context, message);
        return;
      }

      logger.info(message);
    },

    warn(message: string, context?: LogContext) {
      if (context) {
        logger.warn(context, message);
        return;
      }

      logger.warn(message);
    },

    error(message: string, context?: LogContext) {
      if (context) {
        logger.error(context, message);
        return;
      }

      logger.error(message);
    },
  };
};
