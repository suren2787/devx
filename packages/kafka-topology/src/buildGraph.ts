import { KafkaTopic } from './parseTopics';

export type GraphNode = {
  id: string;
  label: string;
  type: 'topic' | 'service';
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: 'produces' | 'consumes';
};

export type KafkaTopologyGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

/**
 * Builds a relationship graph from a list of Kafka topics.
 * Topics and services are nodes; edges represent produce/consume relationships.
 */
export function buildKafkaTopologyGraph(topics: KafkaTopic[]): KafkaTopologyGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const serviceSet = new Set<string>();

  // Add topic nodes
  for (const topic of topics) {
    nodes.push({ id: topic.name, label: topic.name, type: 'topic' });
    // Track all producers/consumers as services
    topic.producers.forEach(svc => serviceSet.add(svc));
    topic.consumers.forEach(svc => serviceSet.add(svc));
  }

  // Add service nodes
  for (const svc of serviceSet) {
    nodes.push({ id: svc, label: svc, type: 'service' });
  }

  // Add edges for producers and consumers
  for (const topic of topics) {
    topic.producers.forEach(svc => {
      edges.push({
        id: `produce:${svc}->${topic.name}`,
        source: svc,
        target: topic.name,
        type: 'produces',
      });
    });
    topic.consumers.forEach(svc => {
      edges.push({
        id: `consume:${svc}->${topic.name}`,
        source: topic.name,
        target: svc,
        type: 'consumes',
      });
    });
  }

  return { nodes, edges };
}
