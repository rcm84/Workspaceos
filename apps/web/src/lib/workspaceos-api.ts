export interface WorkspaceOSTemplate {
  slug: string;
  name: string;
  description: string;
  repoUrl: string;
  defaultPort: number;
}

export interface WorkspaceOSProject {
  id: string;
  name: string;
  slug: string;
  status: string;
  templateSlug: string;
  localPath: string;
  port: number;
  databaseUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceOSProjectInput {
  name: string;
  templateSlug: string;
  port?: number;
  databaseUrl: string;
  envJson?: Record<string, string>;
}

interface WorkspaceOSSuccessResponse<T> {
  success: true;
  data: T;
}

interface WorkspaceOSErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}

const parseError = async (response: Response) => {
  const fallbackMessage = `WorkspaceOS API request failed (${response.status})`;

  try {
    const body = (await response.json()) as WorkspaceOSErrorResponse;
    return body.error?.message ?? body.message ?? fallbackMessage;
  } catch {
    const textBody = await response.text();
    return textBody.length > 0 ? textBody : fallbackMessage;
  }
};

const ensureOk = async (response: Response) => {
  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response;
};

const parseSuccess = async <T>(response: Response): Promise<T> => {
  const body = (await response.json()) as WorkspaceOSSuccessResponse<T>;
  return body.data;
};

export const getWorkspaceOSTemplates = async (): Promise<WorkspaceOSTemplate[]> => {
  const response = await fetch('/api/workspaceos/templates');
  await ensureOk(response);
  return parseSuccess(response);
};

export const getWorkspaceOSProjects = async (): Promise<WorkspaceOSProject[]> => {
  const response = await fetch('/api/workspaceos/projects');
  await ensureOk(response);
  return parseSuccess(response);
};

export const getWorkspaceOSProject = async (
  id: string
): Promise<WorkspaceOSProject> => {
  const response = await fetch(`/api/workspaceos/projects/${encodeURIComponent(id)}`);
  await ensureOk(response);
  return parseSuccess(response);
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

  await ensureOk(response);
  return parseSuccess(response);
};

export const generateWorkspaceOSProjectDocker = async (
  id: string
): Promise<{ filePath: string }> => {
  const response = await fetch(
    `/api/workspaceos/projects/${encodeURIComponent(id)}/generate-docker`,
    {
      method: 'POST',
    }
  );

  await ensureOk(response);
  return parseSuccess(response);
};

export const exportWorkspaceOSProject = async (
  id: string
): Promise<{ filePath: string; fileName: string }> => {
  const response = await fetch(`/api/workspaceos/projects/${encodeURIComponent(id)}/export`, {
    method: 'POST',
  });

  await ensureOk(response);
  return parseSuccess(response);
};

export const deleteWorkspaceOSProject = async (
  id: string
): Promise<WorkspaceOSProject> => {
  const response = await fetch(`/api/workspaceos/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  await ensureOk(response);
  return parseSuccess(response);
};
