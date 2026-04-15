import { useQuery } from '@tanstack/react-query';

import { ProjectsTable } from '@colanode/web/features/workspaceos/projects/projects-table';
import { getWorkspaceOSProjects } from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';
import { Skeleton } from '@colanode/ui/components/ui/skeleton';

export const WorkspaceOSDashboardPage = () => {
  const projectsQuery = useQuery({
    queryKey: ['workspaceos', 'projects'],
    queryFn: getWorkspaceOSProjects,
  });

  return (
    <div className="rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">WorkspaceOS Projects</h1>
        <Button asChild>
          <a href="/workspaceos/projects/new">New Project</a>
        </Button>
      </div>

      {projectsQuery.isLoading && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Loading projects...</p>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {projectsQuery.isError && (
        <div className="space-y-2 rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Could not load WorkspaceOS projects.</p>
          <p className="text-sm text-destructive">{projectsQuery.error.message}</p>
          <Button onClick={() => projectsQuery.refetch()} size="sm" variant="secondary">
            Retry
          </Button>
        </div>
      )}

      {projectsQuery.isSuccess && projectsQuery.data.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-base font-medium">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first WorkspaceOS project from a template to get started.
          </p>
          <Button asChild className="mt-4">
            <a href="/workspaceos/projects/new">Create First Project</a>
          </Button>
        </div>
      )}

      {projectsQuery.isSuccess && projectsQuery.data.length > 0 && (
        <ProjectsTable projects={projectsQuery.data} />
      )}
    </div>
  );
};
