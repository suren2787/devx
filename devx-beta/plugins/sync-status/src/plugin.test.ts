import { syncStatusPlugin } from './plugin';

describe('sync-status', () => {
  it('should export plugin', () => {
    expect(syncStatusPlugin).toBeDefined();
  });
});
