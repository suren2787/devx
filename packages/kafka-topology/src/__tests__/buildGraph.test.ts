import path from 'path';
import { parseTopicsFromFile } from '../parseTopics';
import { buildKafkaTopologyGraph } from '../buildGraph';

describe('buildKafkaTopologyGraph', () => {
  it('creates correct nodes and edges from topics.yaml', () => {
    const filePath = path.resolve(__dirname, 'topics.yaml');
    const topics = parseTopicsFromFile(filePath);
    const graph = buildKafkaTopologyGraph(topics);

    // Expect topic nodes
    expect(graph.nodes.find(n => n.id === 'topic1' && n.type === 'topic')).toBeTruthy();
    expect(graph.nodes.find(n => n.id === 'topic2' && n.type === 'topic')).toBeTruthy();

    // Expect service nodes
    expect(graph.nodes.find(n => n.id === 'serviceA' && n.type === 'service')).toBeTruthy();
    expect(graph.nodes.find(n => n.id === 'serviceB' && n.type === 'service')).toBeTruthy();
    expect(graph.nodes.find(n => n.id === 'serviceC' && n.type === 'service')).toBeTruthy();

    // Expect edges
  expect(graph.edges.find(e => e.id === 'produce:serviceA->topic1')).toBeTruthy();
  expect(graph.edges.find(e => e.id === 'produce:serviceB->topic1')).toBeTruthy();
  expect(graph.edges.find(e => e.id === 'consume:serviceC->topic1')).toBeTruthy();
  expect(graph.edges.find(e => e.id === 'produce:serviceE->topic2')).toBeTruthy();
  expect(graph.edges.find(e => e.id === 'consume:serviceA->topic2')).toBeTruthy();
  expect(graph.edges.find(e => e.id === 'consume:serviceF->topic2')).toBeTruthy();
  });
});
