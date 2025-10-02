# Kafka Topology Plugin - Development TODO

Track incremental progress for building the plugin.


## Phase 1: Local YAML Development
- [x] Scaffold plugin structure (folders, initial files, README)
- [x] Design plugin API (YAML schema, input config)
  - Topic YAML schema:
    ```yaml
    - name: string
      partitions: number
      logCompaction: boolean
      producers: [string]
      consumers: [string]
    ```
  - Input config:
    - Path to YAML files/folder
- [x] Parse YAML topic definitions — complete
- [x] Testing (unit tests for parsing/graph) — parser test implemented and passing
- [x] Build relationship graph data — complete
- [x] Render diagram UI (react-flow-renderer) — complete
- [ ] Add topic details panel — planned
- [ ] Add filtering/search — planned
- [ ] Documentation (README, usage) — planned

## Phase 2: GitHub Integration
- [ ] Fetch YAML files from GitHub — planned (deferred to phase 2)
- [ ] Support GitHub repo URL and token in input config

---

Note: For phase 1, focus on building the plugin using local YAML files only. GitHub integration will be added in phase 2.

Mark each item as complete only when the code is implemented and working. Add notes as you progress!