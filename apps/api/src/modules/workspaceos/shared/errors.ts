import { FastifyReply } from 'fastify';

export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export const toWorkspaceOSErrorResponse = (message: string) => ({
  success: false as const,
  error: {
    message,
  },
});

export const sendWorkspaceOSError = (
  reply: FastifyReply,
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send(toWorkspaceOSErrorResponse(error.message));
  }

  const message = error instanceof Error ? error.message : fallbackMessage;
  return reply.code(400).send(toWorkspaceOSErrorResponse(message));
};
