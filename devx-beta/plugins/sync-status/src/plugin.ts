import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const syncStatusPlugin = createPlugin({
  id: 'sync-status',
  routes: {
    root: rootRouteRef,
  },
});

export const SyncStatusPage = syncStatusPlugin.provide(
  createRoutableExtension({
    name: 'SyncStatusPage',
    component: () =>
      import('./components/SyncStatusPage').then(m => m.SyncStatusPage),
    mountPoint: rootRouteRef,
  }),
);
