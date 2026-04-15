import { loadTemplatesFromFilesystem } from '@colanode/server/modules/workspaceos/templates/templates.loader';
import { type TemplateManifest } from '@colanode/server/modules/workspaceos/templates/templates.types';

class TemplatesService {
  async listTemplates(): Promise<TemplateManifest[]> {
    return loadTemplatesFromFilesystem();
  }

  async getTemplate(slug: string): Promise<TemplateManifest | null> {
    const templates = await this.listTemplates();
    return templates.find((template) => template.slug === slug) ?? null;
  }
}

export const templatesService = new TemplatesService();
