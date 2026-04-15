import { z } from 'zod/v4';

export const workspaceOSProjectStatusSchema = z.enum([
  'DRAFT',
  'PROVISIONING',
  'READY',
  'ERROR',
  'ARCHIVED',
]);

export const workspaceOSProjectSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  templateSlug: z.string().trim().min(1),
  status: workspaceOSProjectStatusSchema,
  localPath: z.string().trim().min(1),
  port: z.int().positive(),
  databaseUrl: z.string().trim().min(1),
  envJson: z.record(z.string(), z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const workspaceOSProjectsListSchema = z.array(workspaceOSProjectSchema);

export type WorkspaceOSProjectStatus = z.infer<typeof workspaceOSProjectStatusSchema>;
export type WorkspaceOSProject = z.infer<typeof workspaceOSProjectSchema>;
