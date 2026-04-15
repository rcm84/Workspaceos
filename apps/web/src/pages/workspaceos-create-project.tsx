import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { createWorkspaceOSProject } from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';
import { Input } from '@colanode/ui/components/ui/input';
import { Label } from '@colanode/ui/components/ui/label';
import { Textarea } from '@colanode/ui/components/ui/textarea';

export const WorkspaceOSCreateProjectPage = () => {
  const [name, setName] = useState('');
  const [templateSlug, setTemplateSlug] = useState('starter');
  const [description, setDescription] = useState('');

  const createProjectMutation = useMutation({
    mutationFn: createWorkspaceOSProject,
    onSuccess: (project) => {
      window.location.href = `/workspaceos/projects/${project.id}`;
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createProjectMutation.mutate({
      name,
      templateSlug,
      description: description.length > 0 ? description : undefined,
    });
  };

  return (
    <div className="rounded-lg border p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create WorkspaceOS Project</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Website redesign"
            required
            value={name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-slug">Template slug</Label>
          <Input
            id="template-slug"
            onChange={(event) => setTemplateSlug(event.target.value)}
            required
            value={templateSlug}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-description">Description</Label>
          <Textarea
            id="project-description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional project notes"
            value={description}
          />
        </div>

        {createProjectMutation.isError && (
          <p className="text-sm text-destructive">
            {createProjectMutation.error.message}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button disabled={createProjectMutation.isPending} type="submit">
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
          <Button asChild variant="secondary">
            <a href="/workspaceos">Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  );
};
