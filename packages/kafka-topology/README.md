# Kafka Topology Plugin

A standalone Backstage plugin for visualizing Kafka topic topologies, designed for easy integration, lightweight operation, and extensibility.

## Features
- **Multi-context topology visualization**: See all bounded contexts and their Kafka topics in a single interactive graph.
- **Partition display**: Shows partition count for each topic, with clear layout and overflow handling.
- **Edge rendering**: Visualizes producer/consumer relationships between contexts and topics.
- **Config-driven**: Uses `app-config.yaml` for contracts URL and (optional) GitHub token—no entity annotations required.
- **GitHub integration**: Fetches topic contracts directly from public/private GitHub repositories.
- **Three-column layout**: Uses Dagre for clear separation of contexts, topics, and edges.
- **React Flow UI**: Modern, interactive graph with custom node types and handles.
- **Production-ready**: Minimal dependencies, fast builds, and easy deployment.


## Integration with Backstage

To add the Kafka Topology plugin to your Backstage instance, choose one of these approaches:

### Option 1: Published npm Package (Recommended)

1. **Publish and install the plugin**
   ```bash
   # In your Backstage project
   yarn add @your-org/kafka-topology
   ```

2. **Configure the contracts source**
   - In your Backstage app's `app-config.yaml`, add:
     ```yaml
     kafkaTopology:
       contractsUrl: "https://github.com/your-org/contracts"
       githubToken: "<your-github-token>" # Optional for public repos
     ```

3. **Register the plugin in Backstage**
   - Import and add the page to your app's routes in `packages/app/src/App.tsx`:
     ```tsx
     import { KafkaTopologyPage } from '@your-org/kafka-topology';
     
     // Inside your routes FlatRoutes component:
     <Route path="/kafka-topology" element={<KafkaTopologyPage />} />
     ```

### Option 2: Local Plugin Development

1. **Copy to Backstage plugins directory**
   ```bash
   # Copy the plugin to your Backstage workspace
   cp -r packages/kafka-topology /path/to/your-backstage/plugins/
   ```

2. **Add to workspace packages**
   - In your Backstage root `package.json`, add to workspaces:
     ```json
     {
       "workspaces": {
         "packages": [
           "plugins/*",
           "packages/*"
         ]
       }
     }
     ```

3. **Install dependencies**
   ```bash
   yarn install
   ```

4. **Import and register**
   - In `packages/app/src/App.tsx`:
     ```tsx
     import { KafkaTopologyPage } from '@internal/plugin-kafka-topology';
     
     // Add route:
     <Route path="/kafka-topology" element={<KafkaTopologyPage />} />
     ```

5. **Update plugin package.json**
   - Ensure the plugin's `package.json` has the correct name:
     ```json
     {
       "name": "@internal/plugin-kafka-topology",
       "version": "1.0.0"
     }
     ```

4. **Build and run Backstage**
   - Rebuild and start your app:
     ```bash
     yarn install
     yarn build
     yarn dev
     ```
   - Visit `/kafka-topology` in your Backstage app to view the diagram.

5. **Customization**
   - Update `contractsUrl` for your contracts repo
   - Add a `githubToken` for private repos (optional for public)
   - Style or extend the plugin as needed

   ## Planned Enhancements

   - Search/filter topics and contexts
   - Export topology as image/JSON
   - Health indicators for topics/contexts
   - Customizable node/edge styles

   ## Design Overview

   - Uses config-driven GitHub loader for topic contracts
   - React Flow custom node types for topics/partitions
   - Dagre layout for three-column graph
   - No entity annotations required

   ## Usage (Standalone)

   1. Configure `app-config.yaml` with your contracts repo URL and (optional) GitHub token
   2. Run the plugin locally with Vite
   3. View the topology diagram in your browser

   ---

   For more details, see the [docs](../../docs/) or contact the maintainers.
## License
MIT

---
For questions or contributions, open an issue or pull request on GitHub.
