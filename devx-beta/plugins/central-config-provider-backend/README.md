# central-config-provider-backend

A Backstage backend plugin that automatically syncs entities from a centralized configuration repository.

## Features

- **Automatic entity synchronization** from GitHub repositories
- **Configurable refresh interval** for periodic syncing
- **REST API endpoints** for sync status and manual sync triggering
- **Error tracking** and logging for sync operations

## Configuration

Add the following to your `app-config.yaml`:

```yaml
centralConfig:
  # GitHub repository URL containing entity YAML files
  repoUrl: "https://github.com/your-org/your-config-repo"
  # GitHub token for authentication (optional for public repos)
  githubToken: "${GITHUB_TOKEN}"
  # Refresh interval in minutes (default: 10)
  refreshInterval: 10
```

## Installation

This plugin is already installed in the backend. It's registered in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@internal/plugin-central-config-provider-backend'));
```

## API Endpoints

- `GET /api/central-config-provider/sync-status` - Get the last sync status
- `POST /api/central-config-provider/sync` - Trigger a manual sync

## Usage

The plugin automatically:
1. Fetches all YAML files from the configured repository root
2. Parses and validates them as Backstage entities
3. Adds them to the catalog
4. Periodically refreshes the entities based on the configured interval

## Development

This plugin backend can be started in a standalone mode from directly in this
package with `yarn start`. It is a limited setup that is most convenient when
developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn start` from the root directory.
