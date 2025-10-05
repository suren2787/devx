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
- **Modern UI components** with React Flow and professional styling
- **GitHub integration** for fetching topic contracts
- **Production-ready** and fully documented

## 🏗 Project Structure

```
devx/
├── devx-beta/                   # Complete Backstage workspace
│   ├── packages/
│   │   ├── app/                 # Backstage frontend app
│   │   └── backend/             # Backstage backend
│   ├── plugins/
│   │   └── kafka-topology/      # Custom Kafka topology plugin
│   ├── app-config.yaml          # Backstage configuration
│   └── package.json             # Workspace dependencies
├── docs/                        # Documentation
└── README.md                    # This file
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

## 📦 Kafka Topology Plugin Features

- **Multi-context visualization** of Kafka topics and relationships
- **Partition count badges** on topic nodes
- **Topic filtering** for finding specific topics quickly
- **Modern UI** with gradients, shadows, and professional styling
- **GitHub integration** for loading topic contracts
- **Three-column layout** (Producers → Topics → Consumers)

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