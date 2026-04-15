import { WorkspaceOSProject } from '@colanode/web/lib/workspaceos-api';
import { ProjectStatusBadge } from '@colanode/web/features/workspaceos/projects/project-status-badge';
import { TemplatePill } from '@colanode/web/features/workspaceos/templates/template-pill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@colanode/ui/components/ui/table';

interface ProjectsTableProps {
  projects: WorkspaceOSProject[];
}

export const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Template</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const createdDate = new Date(project.createdAt);

          return (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell>
                <TemplatePill templateSlug={project.templateSlug} />
              </TableCell>
              <TableCell>{createdDate.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <a className="text-primary underline" href={`/workspaceos/projects/${project.id}`}>
                  Open
                </a>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
