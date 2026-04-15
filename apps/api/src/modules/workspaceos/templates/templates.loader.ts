import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  WORKSPACEOS_TEMPLATE_MANIFEST_FILE_NAME,
} from '@colanode/server/modules/workspaceos/shared/constants';
import { createWorkspaceOSLogger } from '@colanode/server/modules/workspaceos/shared/logger';
import {
  templateManifestSchema,
  type TemplateManifest,
} from '@colanode/server/modules/workspaceos/templates/templates.types';

const logger = createWorkspaceOSLogger('templates-loader');

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.resolve(moduleDir, '../../../../../templates');

const loadTemplateManifest = async (
  templatePath: string
): Promise<TemplateManifest | null> => {
  const manifestPath = path.join(templatePath, WORKSPACEOS_TEMPLATE_MANIFEST_FILE_NAME);

  try {
    const raw = await readFile(manifestPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return templateManifestSchema.parse(parsed);
  } catch (error) {
    logger.warn('Skipping invalid template manifest', { error, manifestPath });
    return null;
  }
};

export const loadTemplatesFromFilesystem = async (): Promise<TemplateManifest[]> => {
  try {
    const entries = await readdir(templatesRoot, { withFileTypes: true });
    const manifests = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => loadTemplateManifest(path.join(templatesRoot, entry.name)))
    );

    return manifests
      .filter(
        (manifest: TemplateManifest | null): manifest is TemplateManifest =>
          manifest !== null
      )
      .sort((a: TemplateManifest, b: TemplateManifest) => a.slug.localeCompare(b.slug));
  } catch (error) {
    logger.warn('Templates root could not be loaded, returning empty template list', {
      error,
      templatesRoot,
    });
    return [];
  }
};
