import { HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { CentralConfigEntityProvider } from './providers/CentralConfigEntityProvider';

export async function createRouter({
  httpAuth,
  entityProvider,
}: {
  httpAuth: HttpAuthService;
  entityProvider: CentralConfigEntityProvider;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  // Get sync status endpoint
  router.get('/sync-status', async (_req, res) => {
    const status = entityProvider.getSyncStatus();
    res.json({
      lastSyncTime: status.lastSyncTime?.toISOString(),
      status: status.status || 'unknown',
      error: status.error,
    });
  });

  // Trigger manual sync endpoint
  router.post('/sync', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });
    await entityProvider.sync();
    res.json({ message: 'Sync triggered successfully' });
  });

  return router;
}
