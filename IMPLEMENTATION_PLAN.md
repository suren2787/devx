# Backstage Integration Implementation Plan

## Overview
This plan guides the integration of Backstage into the project, focusing on:
- Persistent storage setup
- Custom entity provider for centralized config repo
- Sync status UI
- Extensibility for custom plugins (e.g., Kafka topology)

---

## Iteration 1: Initial Backstage & Persistent Storage Setup
- [ ] Set up Backstage application locally.
- [ ] Install and configure PostgreSQL for persistent storage.
- [ ] Update `app-config.yaml` to connect Backstage to PostgreSQL.
- [ ] Run database migrations (`yarn backstage-cli migrations apply --env=production`).
- [ ] Verify entity persistence and recovery after backend restart.

---

## Iteration 2: Custom Entity Provider for Centralized Config Repo
- [ ] Scaffold a backend plugin (e.g., `central-config-provider`) in `plugins/`.
- [ ] Implement logic to fetch and parse YAML/JSON from the centralized config repo (using GitHub API or git).
- [ ] Map config data to Backstage entity format.
- [ ] Emit entities to the catalog at a configurable refresh interval.
- [ ] Register the entity provider in `packages/backend/src/plugins/catalog.ts`.
- [ ] Add refresh interval settings to `app-config.yaml`.

---

## Iteration 3: Sync Status Tracking & UI
- [ ] Track last successful sync timestamp in the entity provider (memory/file/DB).
- [ ] Expose a REST API endpoint (e.g., `/central-config/last-sync`) in the backend plugin.
- [ ] Scaffold a frontend plugin/component to display last sync time and status.
- [ ] Fetch sync status from backend and render in Backstage UI.

---

## Iteration 4: Extending for Custom Plugins (Kafka Topology Example)
- [ ] Scaffold backend/frontend plugin for Kafka topology.
- [ ] Fetch Kafka topology YAML files from GitHub.
- [ ] Parse and visualize Kafka clusters, brokers, topics using a diagram library (e.g., Cytoscape.js).
- [ ] (Optional) Map Kafka entities to Backstage catalog for ownership/relations.

---

## Iteration 5: Testing & Production Readiness
- [ ] End-to-end testing of entity ingestion, persistence, sync status, and plugin functionality.
- [ ] Add logging and monitoring for syncs and errors.
- [ ] Document setup, config options, and plugin usage.

---

## Example TODO List (Quick Reference)
- [ ] Backstage & DB setup
- [ ] Custom entity provider plugin
- [ ] Config repo data fetch & mapping
- [ ] Register entity provider
- [ ] Refresh interval config
- [ ] Sync status tracking & API
- [ ] Sync status UI
- [ ] Kafka topology plugin
- [ ] Kafka YAML parsing & visualization
- [ ] (Optional) Catalog mapping for Kafka entities
- [ ] Testing & logging
- [ ] Documentation

---

Would you like me to create and commit this file (`IMPLEMENTATION_PLAN.md`) in your devx repository now? If yes, I'll proceed with the update.
