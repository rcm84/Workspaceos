import { FormEvent } from 'react';

import { type WorkspaceOSTemplate } from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';
import { Input } from '@colanode/ui/components/ui/input';
import { Label } from '@colanode/ui/components/ui/label';

interface CreateProjectFormValues {
  name: string;
  templateSlug: string;
  port: string;
  databaseUrl: string;
}

interface WorkspaceOSCreateProjectFormProps {
  errorMessage?: string;
  isSubmitting: boolean;
  templates: WorkspaceOSTemplate[];
  values: CreateProjectFormValues;
  onChange: (nextValues: CreateProjectFormValues) => void;
  onSubmit: () => void;
}

export const WorkspaceOSCreateProjectForm = ({
  errorMessage,
  isSubmitting,
  templates,
  values,
  onChange,
  onSubmit,
}: WorkspaceOSCreateProjectFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="project-name">Name</Label>
        <Input
          id="project-name"
          onChange={(event) => onChange({ ...values, name: event.target.value })}
          placeholder="workspace-app"
          required
          value={values.name}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-slug">Template</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          id="template-slug"
          onChange={(event) => onChange({ ...values, templateSlug: event.target.value })}
          required
          value={values.templateSlug}
        >
          <option disabled value="">
            Select a template
          </option>
          {templates.map((template) => (
            <option key={template.slug} value={template.slug}>
              {template.name} ({template.slug})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-port">Port</Label>
        <Input
          id="project-port"
          min={1}
          onChange={(event) => onChange({ ...values, port: event.target.value })}
          placeholder="4000"
          required
          type="number"
          value={values.port}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-database-url">Database URL</Label>
        <Input
          id="project-database-url"
          onChange={(event) => onChange({ ...values, databaseUrl: event.target.value })}
          placeholder="postgres://user:password@localhost:5432/workspace"
          required
          value={values.databaseUrl}
        />
      </div>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex items-center gap-3">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
        <Button asChild variant="secondary">
          <a href="/workspaceos">Cancel</a>
        </Button>
      </div>
    </form>
  );
};
