# Backstage Custom Plugins Workspace

A **truly lightweight** development environment for creating custom Backstage plugins without the massive dependency overhead.

## 🎯 The Problem with Standard Approaches

### ❌ Full Backstage Fork
- **1GB+ repository size** 
- **GitHub storage limits** exceeded on free accounts
- **90% irrelevant code** for plugin development
- **Complex upstream syncing**

### ❌ Standard Plugin Templates  
- **400MB+ dependencies** even for simple plugins
- **Hundreds of transitive dependencies**
- **Slow install times**
- **Still too heavy for simple development**

### ✅ Our Lightweight Solution
- **~50MB total** for complete development setup
- **Minimal dependencies** - only what you actually need
- **Fast installs** and builds
- **GitHub-friendly** fits easily in free accounts
- **Production-ready** plugins that work anywhere

## 🏗 Project Structure

```
backstage-plugins/
├── packages/
│   ├── example-plugin/          # Your plugin code
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── plugin.ts        # Plugin definition
│   │   │   └── index.ts         # Exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── [your-next-plugin]/
├── docs/                        # Documentation
├── scripts/                     # Development utilities
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies (Minimal!)
```bash
yarn install
# Only ~50MB vs 1GB+ for full Backstage
```

### 2. Build Your Plugin
```bash
cd packages/example-plugin
yarn build
```

### 3. Test Locally
```bash
# Link to existing Backstage app for testing
cd /path/to/existing/backstage/app
yarn add file:../path/to/your/plugin
```

### 4. Publish to npm
```bash
npm publish
```

## 📦 Using Your Plugin in Any Backstage App

Once published, any Backstage instance can use your plugin:

### Install
```bash
yarn add @yourorg/backstage-plugin-name
```

### Configure
```typescript
// packages/app/src/App.tsx
import { ExamplePage } from '@yourorg/backstage-plugin-name';

const routes = (
  <FlatRoutes>
    <Route path="/your-plugin" element={<ExamplePage />} />
  </FlatRoutes>
);
```

### Add to Sidebar
```typescript
// packages/app/src/components/Root/Root.tsx
import { yourPluginRef } from '@yourorg/backstage-plugin-name';

<SidebarItem icon={ExtensionIcon} to="your-plugin" text="Your Plugin" />
```

## 💡 Development Philosophy

**"Build plugins, not platforms"**

- **Focus on your plugin logic**, not Backstage infrastructure
- **Minimal footprint** during development
- **Maximum compatibility** when deployed
- **Easy sharing** via npm

## 🔧 Available Commands

```bash
yarn build          # Build all plugins
yarn test           # Run tests
yarn lint           # Lint code
yarn clean          # Clean build artifacts
```

## � Creating New Plugins

1. **Copy the example plugin**:
   ```bash
   cp -r packages/example-plugin packages/my-new-plugin
   ```

2. **Update package.json**:
   ```json
   {
     "name": "@yourorg/backstage-plugin-my-new-plugin",
     "version": "0.1.0"
   }
   ```

3. **Develop your plugin**:
   - Edit `src/components/` for UI
   - Update `src/plugin.ts` for plugin config
   - Build and test

4. **Publish**:
   ```bash
   npm publish
   ```

## 🎯 Benefits Summary

| Aspect | Full Fork | Standard Template | **Our Approach** |
|--------|-----------|-------------------|-------------------|
| Size | 1GB+ | 400MB+ | **~50MB** |
| Install Time | 5-10 min | 2-3 min | **30 sec** |
| GitHub Friendly | ❌ | ⚠️ | **✅** |
| Development Speed | Slow | Medium | **Fast** |
| Deployment | Complex | Medium | **Simple** |

## 🤝 Contributing

1. Create your plugin in `packages/`
2. Test thoroughly
3. Add documentation
4. Submit PR

## 📚 Resources

- [Backstage Plugin Development](https://backstage.io/docs/plugins/)
- [Plugin Architecture](https://backstage.io/docs/plugins/plugin-development)
- [Publishing Plugins](https://backstage.io/docs/plugins/publishing)

---

**💡 Pro Tip**: This approach lets you build production-ready plugins in minutes, not hours!