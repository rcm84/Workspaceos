import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { WorkspaceOSProjectDetailPanel } from '@colanode/web/features/workspaceos/projects/project-detail-panel';
import {
  deleteWorkspaceOSProject,
  exportWorkspaceOSProject,
  generateWorkspaceOSProjectDocker,
  getWorkspaceOSProject,
} from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';
import { Skeleton } from '@colanode/ui/components/ui/skeleton';

interface WorkspaceOSProjectDetailPageProps {
  projectId: string;
}

export const WorkspaceOSProjectDetailPage = ({
  projectId,
}: WorkspaceOSProjectDetailPageProps) => {
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string>();

  const projectQuery = useQuery({
    queryKey: ['workspaceos', 'project', projectId],
    queryFn: () => getWorkspaceOSProject(projectId),
  });

  const generateDockerMutation = useMutation({
    mutationFn: () => generateWorkspaceOSProjectDocker(projectId),
    onSuccess: (result) => {
      setActionSuccessMessage(`Docker files generated at ${result.filePath}`);
    },
  });

  const exportZipMutation = useMutation({
    mutationFn: () => exportWorkspaceOSProject(projectId),
    onSuccess: (result) => {
      setActionSuccessMessage(
        `Export created: ${result.fileName} (${result.filePath})`
      );
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteWorkspaceOSProject(projectId),
    onSuccess: () => {
      window.location.href = '/workspaceos';
    },
  });

  const actionErrorMessage =
    (generateDockerMutation.isError && generateDockerMutation.error.message) ||
    (exportZipMutation.isError && exportZipMutation.error.message) ||
    (deleteProjectMutation.isError && deleteProjectMutation.error.message);

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Project Details</h1>
        <Button asChild variant="secondary">
          <a href="/workspaceos">Back to Dashboard</a>
        </Button>
      </div>

      {projectQuery.isLoading && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Loading project details...</p>
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {projectQuery.isError && (
        <div className="space-y-2 rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Could not load project details.</p>
          <p className="text-sm text-destructive">{projectQuery.error.message}</p>
          <Button onClick={() => projectQuery.refetch()} size="sm" variant="secondary">
            Retry
          </Button>
        </div>
      )}

      {projectQuery.isSuccess && (
        <WorkspaceOSProjectDetailPanel
          actionErrorMessage={actionErrorMessage}
          actionSuccessMessage={actionSuccessMessage}
          isDeletingProject={deleteProjectMutation.isPending}
          isExportingZip={exportZipMutation.isPending}
          isGeneratingDocker={generateDockerMutation.isPending}
          onDeleteProject={() => {
            const isConfirmed = window.confirm(
              'Delete this project? This archives it and hides it from the active flow.'
            );

            if (!isConfirmed) {
              return;
            }

            setActionSuccessMessage(undefined);
            deleteProjectMutation.mutate();
          }}
          onExportZip={() => {
            setActionSuccessMessage(undefined);
            exportZipMutation.mutate();
          }}
          onGenerateDocker={() => {
            setActionSuccessMessage(undefined);
            generateDockerMutation.mutate();
          }}
          project={projectQuery.data}
        />
      )}
    </div>
  );
};
