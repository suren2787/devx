import {
  startTestBackend,
} from '@backstage/backend-test-utils';
import { centralConfigProviderPlugin } from './plugin';
import request from 'supertest';

describe('plugin', () => {
  it('should return sync status', async () => {
    const { server } = await startTestBackend({
      features: [centralConfigProviderPlugin],
    });

    const response = await request(server)
      .get('/api/central-config-provider/sync-status');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });

  it('should allow manual sync trigger', async () => {
    const { server } = await startTestBackend({
      features: [centralConfigProviderPlugin],
    });

    const response = await request(server)
      .post('/api/central-config-provider/sync');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});
