import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef } from 'react';

import { WorkspaceOSRoutes } from '@colanode/web/features/workspaceos/workspaceos-routes';

export const WorkspaceOSRoot = () => {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <main className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col gap-4 px-4 py-8">
        <WorkspaceOSRoutes />
      </main>
    </QueryClientProvider>
  );
};
