import { ContextTopics } from './scanContexts';
import { KafkaTopic } from './parseTopics';

export type GraphNode = {
  id: string;
  label: string;
  type: 'topic' | 'service';
  context?: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: 'produces' | 'consumes';
  context?: string;
};

export type KafkaTopologyGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
/**
 * Builds a relationship graph from multiple bounded contexts.
 * Each context's topics/services are grouped, and cross-context relationships are visible.
 */
export function buildKafkaTopologyGraphFromContexts(contexts: ContextTopics[]): KafkaTopologyGraph {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const serviceSet = new Set<string>();

  for (const { context, topics } of contexts) {
    for (const topic of topics) {
      // Topic node with context and partition count
      console.log('Topic data:', topic); // Debug log
      const partitionCount = topic.partitions || 1; // Default to 1 if not specified
      const topicLabel = `${topic.name} (${partitionCount}p)`;
      nodes.push({ id: `${context}:${topic.name}`, label: topicLabel, type: 'topic', context });
      // Track all producers/consumers as services (with context)
      topic.producers?.forEach((svc: string) => serviceSet.add(`${context}:${svc}`));
      topic.consumers?.forEach((svc: string) => serviceSet.add(`${context}:${svc}`));
    }
  }

  // Add service nodes
  for (const svc of serviceSet) {
    const [context, name] = svc.split(':');
    nodes.push({ id: svc, label: name, type: 'service', context });
  }

  // Add edges for producers and consumers
  for (const { context, topics } of contexts) {
    for (const topic of topics) {
      topic.producers.forEach((svc: string) => {
        edges.push({
          id: `produce:${context}:${svc}->${context}:${topic.name}`,
          source: `${context}:${svc}`,
          target: `${context}:${topic.name}`,
          type: 'produces',
          context,
        });
      });
      topic.consumers.forEach((svc: string) => {
        edges.push({
          id: `consume:${context}:${topic.name}->${context}:${svc}`,
          source: `${context}:${topic.name}`,
          target: `${context}:${svc}`,
          type: 'consumes',
          context,
        });
      });
    }
  }
  return { nodes, edges };
}
