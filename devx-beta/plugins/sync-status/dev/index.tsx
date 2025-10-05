import { createDevApp } from '@backstage/dev-utils';
import { syncStatusPlugin, SyncStatusPage } from '../src/plugin';

createDevApp()
  .registerPlugin(syncStatusPlugin)
  .addPage({
    element: <SyncStatusPage />,
    title: 'Root Page',
    path: '/sync-status',
  })
  .render();
