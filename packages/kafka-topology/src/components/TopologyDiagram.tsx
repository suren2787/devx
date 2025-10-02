import React, { useState } from 'react';
import ReactFlow, { Node, Edge, Background, Controls } from 'react-flow-renderer';
import { getDagreLayoutNodes } from './layout';
import { KafkaTopologyGraph, GraphNode, GraphEdge } from '../buildGraph';

// Generate a color for each context
function getContextColor(context: string, idx: number): string {
	const palette = [
		'#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6',
		'#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3',
		'#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000', '#b6b6b4', '#c2b280',
		'#ffb347', '#c0c0c0', '#b22222', '#228b22', '#4682b4', '#daa520', '#8a2be2', '#20b2aa'
	];
	return palette[idx % palette.length];
}

// Use dagre layout for cleaner positioning
function toReactFlowNodes(graph: KafkaTopologyGraph): Node[] {
	return getDagreLayoutNodes(graph);
}

function toReactFlowEdges(graph: KafkaTopologyGraph): Edge[] {
	return graph.edges.map((edge: GraphEdge) => ({
		id: edge.id,
		source: edge.source,
		target: edge.target,
		label: edge.type === 'produces' ? 'produces' : 'consumes',
		animated: false,
		style: edge.type === 'consumes' 
			? { stroke: '#1976d2', strokeWidth: 3, strokeDasharray: '5,5' } 
			: { stroke: '#e74c3c', strokeWidth: 2 },
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
		? topics.find((t: any) => `${t.context ? t.context + ':' : ''}${t.name}` === selectedTopic)
		: null;

	// Build context legend
	const contextList = Array.from(new Set(graph.nodes.map((n: GraphNode) => typeof n.context === 'string' ? n.context : '').filter((ctx): ctx is string => !!ctx)));
	const contextColorMap: Record<string, string> = {};
	contextList.forEach((ctx, idx) => {
		contextColorMap[String(ctx)] = getContextColor(String(ctx), idx);
	});

	function handleNodeClick(_: any, node: Node) {
		if (node.type === 'topic') {
			setSelectedTopic(node.id);
		} else {
			setSelectedTopic(null);
		}
	}

	return (
		<div style={{ display: 'flex', width: '100%', height: '600px' }}>
			<div style={{ flex: 1, position: 'relative' }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					fitView
					onNodeClick={handleNodeClick}
				>
					<Background />
					<Controls />
				</ReactFlow>
				{/* Node type legend */}
				<div style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #eee', padding: 8, borderRadius: 4, zIndex: 10 }}>
					<strong>Legend:</strong>
					<ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
						<li style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
							<span style={{ width: 24, height: 24, background: '#fffbe6', border: '2px solid #fbc02d', borderRadius: 8, display: 'inline-block', marginRight: 8 }}></span>
							<span><strong>Topic</strong></span>
						</li>
						<li style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
							<span style={{ width: 24, height: 24, background: '#e3f2fd', border: '2px solid #1976d2', borderRadius: 20, display: 'inline-block', marginRight: 8 }}></span>
							<span>Service</span>
						</li>
						<li style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
							<span style={{ width: 32, height: 4, background: '#e74c3c', display: 'inline-block', marginRight: 8 }}></span>
							<span>Produces</span>
						</li>
						<li style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
							<span style={{ width: 32, height: 4, background: '#1976d2', display: 'inline-block', marginRight: 8 }}></span>
							<span>Consumes</span>
						</li>
					</ul>
				</div>
			</div>
			{selectedTopic && topicMeta && (
				<div style={{ width: 300, padding: 16, background: '#fafafa', borderLeft: '1px solid #eee' }}>
					<h3>Topic Details</h3>
					<div><strong>Name:</strong> {topicMeta.name}</div>
					<div><strong>Context:</strong> {topicMeta.context || (selectedTopic?.split(':')[0])}</div>
					<div><strong>Partitions:</strong> {topicMeta.partitions}</div>
					<div><strong>Log Compaction:</strong> {topicMeta.logCompaction ? 'Enabled' : 'Disabled'}</div>
					<div><strong>Producers:</strong> {topicMeta.producers?.join(', ')}</div>
					<div><strong>Consumers:</strong> {topicMeta.consumers?.join(', ')}</div>
				</div>
			)}
		</div>
	);
};