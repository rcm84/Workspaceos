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
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {projectsQuery.isError && (
        <p className="text-sm text-destructive">{projectsQuery.error.message}</p>
      )}

      {projectsQuery.isSuccess && <ProjectsTable projects={projectsQuery.data} />}
    </div>
  );
};
