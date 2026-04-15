import { z } from 'zod/v4';

export const templateEnvVariableSchema = z.object({
  key: z.string().trim().min(1),
  required: z.boolean(),
});

export const templateManifestSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  repoUrl: z.string().url(),
  defaultPort: z.int().positive(),
  env: z.array(templateEnvVariableSchema),
});

export const templatesListResponseSchema = z.array(templateManifestSchema);

export type TemplateManifest = z.infer<typeof templateManifestSchema>;
