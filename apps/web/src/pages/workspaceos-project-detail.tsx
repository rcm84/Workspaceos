import { useQuery } from '@tanstack/react-query';

import { ProjectStatusBadge } from '@colanode/web/features/workspaceos/projects/project-status-badge';
import { TemplatePill } from '@colanode/web/features/workspaceos/templates/template-pill';
import { getWorkspaceOSProject } from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';
import { Skeleton } from '@colanode/ui/components/ui/skeleton';

interface WorkspaceOSProjectDetailPageProps {
  projectId: string;
}

export const WorkspaceOSProjectDetailPage = ({
  projectId,
}: WorkspaceOSProjectDetailPageProps) => {
  const projectQuery = useQuery({
    queryKey: ['workspaceos', 'project', projectId],
    queryFn: () => getWorkspaceOSProject(projectId),
  });

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Project Details</h1>
        <Button asChild variant="secondary">
          <a href="/workspaceos">Back to Dashboard</a>
        </Button>
      </div>

      {projectQuery.isLoading && <Skeleton className="h-24 w-full" />}

      {projectQuery.isError && (
        <p className="text-sm text-destructive">{projectQuery.error.message}</p>
      )}

      {projectQuery.isSuccess && (
        <div className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">Name:</span> {projectQuery.data.name}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{' '}
            <ProjectStatusBadge status={projectQuery.data.status} />
          </p>
          <p>
            <span className="font-semibold">Template:</span>{' '}
            <TemplatePill templateSlug={projectQuery.data.templateSlug} />
          </p>
          <p>
            <span className="font-semibold">Created:</span>{' '}
            {new Date(projectQuery.data.createdAt).toLocaleString()}
          </p>
          {projectQuery.data.description && (
            <p>
              <span className="font-semibold">Description:</span>{' '}
              {projectQuery.data.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
