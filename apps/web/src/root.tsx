// A workaround to make the globals.css file work in the web app
import '../../../packages/ui/src/styles/globals.css';

import { useRegisterSW } from 'virtual:pwa-register/react';

import { WorkspaceOSRoot } from '@colanode/web/features/workspaceos/workspaceos-root';
import { App } from '@colanode/ui';

export const Root = () => {
  useRegisterSW({
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (window.location.pathname.startsWith('/workspaceos')) {
    return <WorkspaceOSRoot />;
  }

  return (
    <>
      <a
        className="fixed bottom-4 right-4 z-50 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow"
        href="/workspaceos"
      >
        Open WorkspaceOS
      </a>
      <App type="web" />
    </>
  );
};
