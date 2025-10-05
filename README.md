# Backstage DevX Workspace

A **complete Backstage development environment** with custom plugins, designed for easy plugin development and export.

## 🎯 What This Workspace Provides

### ✅ Complete Backstage Instance (devx-beta/)
- **Full working Backstage application** for testing plugins
- **Production-ready environment** with all standard Backstage features
- **Integrated custom plugins** for development and testing
- **Easy export** to other Backstage instances

### ✅ Custom Plugin Development
- **Kafka Topology Plugin** - Visualize Kafka topic relationships
- **Central Config Provider** - Automatically sync entities from GitHub repositories
- **Sync Status UI** - Monitor and manage entity synchronization
- **Modern UI components** with React Flow and professional styling
- **GitHub integration** for fetching topic contracts and config files
- **Production-ready** and fully documented

## 🏗 Project Structure

```
devx/
├── devx-beta/                                  # Complete Backstage workspace
│   ├── packages/
│   │   ├── app/                                # Backstage frontend app
│   │   └── backend/                            # Backstage backend
│   ├── plugins/
│   │   ├── kafka-topology/                     # Kafka topology visualization plugin
│   │   ├── central-config-provider-backend/    # Entity provider backend plugin
│   │   └── sync-status/                        # Sync status monitoring UI plugin
│   ├── app-config.yaml                         # Backstage configuration
│   └── package.json                            # Workspace dependencies
├── docs/                                       # Documentation
├── IMPLEMENTATION_PLAN.md                      # Implementation roadmap
└── README.md                                   # This file
```

## 🚀 Quick Start

### 1. Navigate to Backstage Workspace
```bash
cd devx-beta
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Start Development Server
```bash
yarn start
```

### 4. Visit Your Backstage Instance
- **URL**: http://localhost:3000
- **Kafka Topology Plugin**: http://localhost:3000/kafka-topology
- **Sync Status**: http://localhost:3000/sync-status

## 📦 Plugin Features

### Kafka Topology Plugin
- **Multi-context visualization** of Kafka topics and relationships
- **Partition count badges** on topic nodes
- **Topic filtering** for finding specific topics quickly
- **Modern UI** with gradients, shadows, and professional styling
- **GitHub integration** for loading topic contracts
- **Three-column layout** (Producers → Topics → Consumers)

### Central Config Provider Plugin (Backend)
- **Automatic entity synchronization** from GitHub repositories
- **Configurable refresh interval** (default: 10 minutes)
- **Fetches and parses YAML files** from repository
- **Validates entities** before adding to catalog
- **Error tracking and logging** for sync operations
- **REST API endpoints** for sync status and manual triggering

### Sync Status Plugin (Frontend)
- **Real-time sync status display** with visual indicators
- **Last sync time tracking** with formatted timestamps
- **Error message display** for failed syncs
- **Manual sync trigger** button for on-demand updates
- **Auto-refresh every 30 seconds** for live monitoring
- **Integrated sidebar navigation** for easy access

## 🔧 Exporting Plugins to Other Backstage Instances

### Option 1: Copy Plugin Directory
```bash
# Copy the plugin to target Backstage workspace
cp -r devx-beta/plugins/kafka-topology /path/to/target-backstage/plugins/

# Follow integration steps in the plugin's README
```

### Option 2: Publish to npm
```bash
cd devx-beta/plugins/kafka-topology
yarn build
npm publish
```

## 💡 Development Workflow

1. **Develop plugins** in `devx-beta/plugins/`
2. **Test immediately** in the integrated Backstage app
3. **Export easily** to other Backstage instances
4. **Publish to npm** for wider distribution

## 🔧 Available Commands

```bash
# In devx-beta/ directory:
yarn start          # Start Backstage development server
yarn build:all      # Build all packages
yarn test           # Run tests
yarn lint           # Lint code
yarn clean          # Clean build artifacts
```

## 📚 Plugin Documentation

Detailed documentation for each plugin is available in their respective directories:

- **Kafka Topology Plugin**: `devx-beta/plugins/kafka-topology/README.md`
- **Central Config Provider**: `devx-beta/plugins/central-config-provider-backend/README.md`
- **Sync Status Plugin**: `devx-beta/plugins/sync-status/README.md`

## ⚙️ Configuration

### Central Config Provider Setup

Add the following to `devx-beta/app-config.yaml`:

```yaml
centralConfig:
  # GitHub repository URL containing entity YAML files
  repoUrl: "https://github.com/your-org/your-config-repo"
  # GitHub token for authentication (optional for public repos)
  githubToken: "${GITHUB_TOKEN}"
  # Refresh interval in minutes (default: 10)
  refreshInterval: 10
```

### Environment Variables

Create a `.env` file in the `devx-beta` directory:

```bash
# GitHub token for accessing repositories
GITHUB_TOKEN=your_github_token_here
```

## 🎯 Benefits of This Approach

| Aspect | Benefit |
|--------|---------|
| **Integrated Testing** | Test plugins immediately in real Backstage environment |
| **Easy Export** | Copy or publish plugins to any Backstage instance |
| **Production Ready** | Uses official Backstage CLI and best practices |
| **Complete Environment** | Full Backstage features available for development |
| **Documentation** | Comprehensive guides for integration and usage |

---

**🎉 Ready for custom Backstage plugin development and deployment!**