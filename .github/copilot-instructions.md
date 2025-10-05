# Backstage DevX Workspace

## Project Overview
This is a **complete Backstage development workspace** with integrated custom plugins, designed for plugin development, testing, and easy export to other Backstage instances.

## Why This Approach?
- **Complete Environment**: Full Backstage instance for immediate testing
- **Integrated Development**: Develop and test plugins in real Backstage environment
- **Easy Export**: Copy or publish plugins to any other Backstage instance
- **Production Ready**: Uses official Backstage CLI and best practices
- **GitHub-friendly**: Clean, organized structure

## Architecture
```
devx/
├── devx-beta/                      # Complete Backstage workspace
│   ├── packages/
│   │   ├── app/                    # Backstage frontend application
│   │   └── backend/                # Backstage backend services
│   ├── plugins/
│   │   └── kafka-topology/         # Custom Kafka topology plugin
│   ├── app-config.yaml             # Backstage configuration
│   └── package.json                # Workspace dependencies
├── docs/                           # Project documentation
└── README.md                       # Project overview
```

## Development Workflow
1. **Develop plugins** in `devx-beta/plugins/`
2. **Test immediately** in the integrated Backstage app
3. **Export easily** by copying plugin directories
4. **Publish to npm** for wider distribution

## Current Plugins

### Kafka Topology Plugin (`devx-beta/plugins/kafka-topology/`)
- **Visualizes Kafka topic relationships** across bounded contexts
- **Modern UI** with React Flow, gradients, and professional styling
- **Topic filtering** for finding specific topics quickly
- **Partition count badges** on topic nodes
- **GitHub integration** for loading topic contracts
- **Three-column layout** (Producers → Topics → Consumers)
- **Production ready** with comprehensive documentation

## Key Commands
```bash
# Navigate to workspace
cd devx-beta

# Start development server
yarn start                 # Backstage at http://localhost:3000

# Plugin development
yarn build                 # Build all packages
yarn test                  # Run tests
yarn lint                  # Lint code

# Plugin-specific (in devx-beta/plugins/kafka-topology/)
yarn dev                   # Plugin development mode
yarn build                 # Build plugin for export
```

## Plugin Export Process

### To Other Backstage Instances:
1. **Copy plugin directory**: `cp -r devx-beta/plugins/kafka-topology /target/plugins/`
2. **Add workspace dependency**: Update target's package.json
3. **Import in App.tsx**: Add route and components
4. **Install dependencies**: `yarn install`

### To npm Registry:
1. **Build plugin**: `cd devx-beta/plugins/kafka-topology && yarn build`
2. **Publish**: `npm publish`
3. **Install elsewhere**: `yarn add @your-org/plugin-kafka-topology`

## Setup Status
✅ **Complete Backstage workspace ready for development!**

- [x] Full Backstage instance (devx-beta/)
- [x] Kafka topology plugin integrated
- [x] Modern UI with React Flow visualization
- [x] GitHub integration for topic contracts
- [x] Topic filtering and partition badges
- [x] Professional styling and responsive design
- [x] Comprehensive documentation
- [x] Export-ready plugin structure
- [x] Production-ready configuration

## Development Guidelines
- **Work in devx-beta/ directory** for all development
- **Test plugins immediately** in the integrated Backstage app
- **Follow Backstage CLI patterns** for builds and development
- **Use TypeScript** for all plugin development
- **Include comprehensive documentation** for each plugin
- **Maintain export compatibility** for easy distribution
- **Test integration** before export to ensure compatibility