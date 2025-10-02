import React, { useState } from 'react';
import ReactFlow, { Node, Edge, Background, Controls } from 'react-flow-renderer';
import { KafkaTopologyGraph, GraphNode, GraphEdge } from '../buildGraph';

function toReactFlowNodes(graph: KafkaTopologyGraph): Node[] {
	return graph.nodes.map((node: GraphNode) => ({
		id: node.id,
		data: { label: node.label },
		position: { x: Math.random() * 400, y: Math.random() * 400 }, // TODO: improve layout
		type: node.type === 'topic' ? 'default' : 'input',
	}));
}

function toReactFlowEdges(graph: KafkaTopologyGraph): Edge[] {
	return graph.edges.map((edge: GraphEdge) => ({
		id: edge.id,
		source: edge.source,
		target: edge.target,
		label: edge.type,
		animated: edge.type === 'produces',
	}));
}

export type TopologyDiagramProps = {
	graph: KafkaTopologyGraph;
	topics: any[];
};

export const TopologyDiagram: React.FC<TopologyDiagramProps> = ({ graph, topics }) => {
	const nodes = toReactFlowNodes(graph);
	const edges = toReactFlowEdges(graph);
	const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

	// Find topic details by id from topics prop
	const topicMeta = selectedTopic
		? topics.find((t: any) => t.name === selectedTopic)
		: null;

	function handleNodeClick(_: any, node: Node) {
		if (node.type === 'topic') {
			setSelectedTopic(node.id);
		} else {
			setSelectedTopic(null);
		}
	}

	return (
		<div style={{ display: 'flex', width: '100%', height: '600px' }}>
			<div style={{ flex: 1 }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					fitView
					onNodeClick={handleNodeClick}
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
			{selectedTopic && topicMeta && (
				<div style={{ width: 300, padding: 16, background: '#fafafa', borderLeft: '1px solid #eee' }}>
					<h3>Topic Details</h3>
					<div><strong>Name:</strong> {topicMeta.name}</div>
					<div><strong>Partitions:</strong> {topicMeta.partitions}</div>
					<div><strong>Log Compaction:</strong> {topicMeta.logCompaction ? 'Enabled' : 'Disabled'}</div>
					<div><strong>Producers:</strong> {topicMeta.producers?.join(', ')}</div>
					<div><strong>Consumers:</strong> {topicMeta.consumers?.join(', ')}</div>
				</div>
			)}
		</div>
	);
};