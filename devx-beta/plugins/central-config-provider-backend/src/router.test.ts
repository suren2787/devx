import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { CentralConfigEntityProvider } from './providers/CentralConfigEntityProvider';

describe('createRouter', () => {
  let app: express.Express;
  let mockEntityProvider: jest.Mocked<CentralConfigEntityProvider>;

  beforeEach(async () => {
    mockEntityProvider = {
      getSyncStatus: jest.fn(),
      sync: jest.fn(),
    } as any;

    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      entityProvider: mockEntityProvider,
    });
    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  it('should return sync status', async () => {
    mockEntityProvider.getSyncStatus.mockReturnValue({
      lastSyncTime: new Date('2024-01-01'),
      status: 'success',
    });

    const response = await request(app).get('/sync-status');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('lastSyncTime');
    expect(response.body).toHaveProperty('status', 'success');
  });

  it('should trigger manual sync', async () => {
    mockEntityProvider.sync.mockResolvedValue(undefined);

    const response = await request(app).post('/sync');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(mockEntityProvider.sync).toHaveBeenCalled();
  });

  it('should not allow unauthenticated requests to trigger sync', async () => {
    mockEntityProvider.sync.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/sync')
      .set('Authorization', mockCredentials.none.header());

    expect(response.status).toBe(401);
  });
});
