import { z } from 'zod/v4';

import { workspaceOSProjectStatusSchema } from '@colanode/server/modules/workspaceos/projects/projects.types';

export const workspaceOSProjectParamsSchema = z.object({
  id: z.string().trim().min(1),
});

export const createWorkspaceOSProjectSchema = z.object({
  name: z.string().trim().min(1),
  templateSlug: z.string().trim().min(1),
  port: z.int().positive().optional(),
  databaseUrl: z.string().trim().min(1),
  envJson: z.record(z.string(), z.string()).default({}),
});

export const updateWorkspaceOSProjectSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    status: workspaceOSProjectStatusSchema.optional(),
    port: z.int().positive().optional(),
    databaseUrl: z.string().trim().min(1).optional(),
    envJson: z.record(z.string(), z.string()).optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'At least one field is required',
  });

export type CreateWorkspaceOSProjectInput = z.infer<
  typeof createWorkspaceOSProjectSchema
>;
export type UpdateWorkspaceOSProjectInput = z.infer<
  typeof updateWorkspaceOSProjectSchema
>;
