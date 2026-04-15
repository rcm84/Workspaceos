import { WorkspaceOSCreateProjectPage } from '@colanode/web/pages/workspaceos-create-project';
import { WorkspaceOSDashboardPage } from '@colanode/web/pages/workspaceos-dashboard';
import { WorkspaceOSProjectDetailPage } from '@colanode/web/pages/workspaceos-project-detail';

const getProjectIdFromPathname = (pathname: string) => {
  const detailMatch = pathname.match(/^\/workspaceos\/projects\/([^/]+)$/);

  if (!detailMatch) {
    return null;
  }

  return decodeURIComponent(detailMatch[1]);
};

export const WorkspaceOSRoutes = () => {
  const pathname = window.location.pathname;

  if (pathname === '/workspaceos') {
    return <WorkspaceOSDashboardPage />;
  }

  if (pathname === '/workspaceos/projects/new') {
    return <WorkspaceOSCreateProjectPage />;
  }

  const projectId = getProjectIdFromPathname(pathname);
  if (projectId) {
    return <WorkspaceOSProjectDetailPage projectId={projectId} />;
  }

  return (
    <div className="rounded-lg border p-6">
      <h1 className="text-xl font-semibold">WorkspaceOS route not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Try opening <a className="underline" href="/workspaceos">/workspaceos</a>.
      </p>
    </div>
  );
};
