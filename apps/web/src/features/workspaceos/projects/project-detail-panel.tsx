import { ProjectStatusBadge } from '@colanode/web/features/workspaceos/projects/project-status-badge';
import { TemplatePill } from '@colanode/web/features/workspaceos/templates/template-pill';
import { type WorkspaceOSProject } from '@colanode/web/lib/workspaceos-api';
import { Button } from '@colanode/ui/components/ui/button';

interface WorkspaceOSProjectDetailPanelProps {
  actionErrorMessage?: string;
  actionSuccessMessage?: string;
  isDeletingProject: boolean;
  isExportingZip: boolean;
  isGeneratingDocker: boolean;
  onDeleteProject: () => void;
  onExportZip: () => void;
  onGenerateDocker: () => void;
  project: WorkspaceOSProject;
}

export const WorkspaceOSProjectDetailPanel = ({
  actionErrorMessage,
  actionSuccessMessage,
  isDeletingProject,
  isExportingZip,
  isGeneratingDocker,
  onDeleteProject,
  onExportZip,
  onGenerateDocker,
  project,
}: WorkspaceOSProjectDetailPanelProps) => {
  return (
    <div className="space-y-3 text-sm">
      <p>
        <span className="font-semibold">Name:</span> {project.name}
      </p>
      <p>
        <span className="font-semibold">Status:</span>{' '}
        <ProjectStatusBadge status={project.status} />
      </p>
      <p>
        <span className="font-semibold">Template:</span>{' '}
        <TemplatePill templateSlug={project.templateSlug} />
      </p>
      <p>
        <span className="font-semibold">Port:</span> {project.port}
      </p>
      <p>
        <span className="font-semibold">Database URL:</span> {project.databaseUrl}
      </p>
      {project.localPath && (
        <p>
          <span className="font-semibold">Local Path:</span> {project.localPath}
        </p>
      )}

      <div className="pt-2">
        <p className="mb-2 text-sm font-semibold">Actions</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled={isGeneratingDocker} onClick={onGenerateDocker} variant="secondary">
            {isGeneratingDocker ? 'Generating Docker...' : 'Generate Docker'}
          </Button>
          <Button disabled={isExportingZip} onClick={onExportZip} variant="secondary">
            {isExportingZip ? 'Exporting Zip...' : 'Export Zip'}
          </Button>
          <Button disabled={isDeletingProject} onClick={onDeleteProject} variant="destructive">
            {isDeletingProject ? 'Deleting...' : 'Delete Project'}
          </Button>
        </div>
      </div>

      {actionSuccessMessage && (
        <p className="text-sm text-emerald-600">{actionSuccessMessage}</p>
      )}
      {actionErrorMessage && (
        <p className="text-sm text-destructive">{actionErrorMessage}</p>
      )}
    </div>
  );
};
