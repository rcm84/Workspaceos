import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { WorkspaceOSCreateProjectForm } from '@colanode/web/features/workspaceos/projects/create-project-form';
import {
  createWorkspaceOSProject,
  getWorkspaceOSTemplates,
} from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';
import { Skeleton } from '@colanode/ui/components/ui/skeleton';

interface CreateProjectFormValues {
  name: string;
  templateSlug: string;
  port: string;
  databaseUrl: string;
}

export const WorkspaceOSCreateProjectPage = () => {
  const [formValues, setFormValues] = useState<CreateProjectFormValues>({
    name: '',
    templateSlug: '',
    port: '',
    databaseUrl: '',
  });

  const templatesQuery = useQuery({
    queryKey: ['workspaceos', 'templates'],
    queryFn: getWorkspaceOSTemplates,
  });

  useEffect(() => {
    if (!templatesQuery.data || templatesQuery.data.length === 0) {
      return;
    }

    setFormValues((previous) => {
      const selectedTemplate =
        templatesQuery.data.find((template) => template.slug === previous.templateSlug) ??
        templatesQuery.data[0];

      const hasSelectedTemplate = previous.templateSlug.length > 0;
      const nextPort = hasSelectedTemplate
        ? previous.port
        : selectedTemplate.defaultPort.toString();

      return {
        ...previous,
        templateSlug: hasSelectedTemplate ? previous.templateSlug : selectedTemplate.slug,
        port: nextPort,
      };
    });
  }, [templatesQuery.data]);

  const createProjectMutation = useMutation({
    mutationFn: createWorkspaceOSProject,
    onSuccess: (project) => {
      window.location.href = `/workspaceos/projects/${project.id}`;
    },
  });

  const handleSubmit = () => {
    const parsedPort = Number.parseInt(formValues.port, 10);

    createProjectMutation.mutate({
      name: formValues.name,
      templateSlug: formValues.templateSlug,
      port: Number.isFinite(parsedPort) ? parsedPort : undefined,
      databaseUrl: formValues.databaseUrl,
    });
  };

  return (
    <div className="rounded-lg border p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create WorkspaceOS Project</h1>

      {templatesQuery.isLoading && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Loading templates...</p>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {templatesQuery.isError && (
        <div className="space-y-2 rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Unable to load templates.</p>
          <p className="text-sm text-destructive">{templatesQuery.error.message}</p>
          <Button onClick={() => templatesQuery.refetch()} size="sm" variant="secondary">
            Retry
          </Button>
        </div>
      )}

      {templatesQuery.isSuccess && templatesQuery.data.length === 0 && (
        <div className="rounded-md border border-dashed p-6">
          <p className="font-medium">No templates found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add template manifests to the WorkspaceOS templates directory, then refresh this page.
          </p>
          <Button asChild className="mt-4" variant="secondary">
            <a href="/workspaceos">Back to Dashboard</a>
          </Button>
        </div>
      )}

      {templatesQuery.isSuccess && templatesQuery.data.length > 0 && (
        <WorkspaceOSCreateProjectForm
          errorMessage={createProjectMutation.isError ? createProjectMutation.error.message : undefined}
          isSubmitting={createProjectMutation.isPending}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          templates={templatesQuery.data}
          values={formValues}
        />
      )}
    </div>
  );
};
