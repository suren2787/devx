import React, { useEffect, useState } from 'react';
import path from 'path';
import { parseTopicsFromFile } from '../parseTopics';
import { buildKafkaTopologyGraph, KafkaTopologyGraph } from '../buildGraph';
import { TopologyDiagram } from './TopologyDiagram';

export const KafkaTopologyPage: React.FC = () => {
  const [graph, setGraph] = useState<KafkaTopologyGraph | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  useEffect(() => {
    // Load YAML and build graph (local file for demo)
    const filePath = path.resolve(__dirname, '../__tests__/topics.yaml');
    try {
      const loadedTopics = parseTopicsFromFile(filePath);
      setTopics(loadedTopics);
      setGraph(buildKafkaTopologyGraph(loadedTopics));
    } catch (e) {
      setGraph(null);
      setTopics([]);
    }
  }, []);

  return (
    <div>
      <h2>Kafka Topology Diagram</h2>
      {graph ? <TopologyDiagram graph={graph} topics={topics} /> : <div>Failed to load graph data.</div>}
    </div>
  );
};
