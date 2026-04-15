export interface WorkspaceOSProject {
  id: string;
  name: string;
  status: string;
  templateSlug: string;
  createdAt: string;
  description?: string;
}

export interface CreateWorkspaceOSProjectInput {
  name: string;
  templateSlug: string;
  description?: string;
}

const parseError = async (response: Response) => {
  const body = await response.text();
  const fallbackMessage = `WorkspaceOS API request failed (${response.status})`;
  return body.length > 0 ? body : fallbackMessage;
};

export const getWorkspaceOSProjects = async (): Promise<WorkspaceOSProject[]> => {
  const response = await fetch('/api/workspaceos/projects');

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const getWorkspaceOSProject = async (
  id: string
): Promise<WorkspaceOSProject> => {
  const response = await fetch(`/api/workspaceos/projects/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const createWorkspaceOSProject = async (
  input: CreateWorkspaceOSProjectInput
): Promise<WorkspaceOSProject> => {
  const response = await fetch('/api/workspaceos/projects', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};
