import React, { useEffect, useState } from 'react';
import yaml from 'js-yaml';
import { buildKafkaTopologyGraphFromContexts, KafkaTopologyGraph } from '../buildGraph';
import { TopologyDiagram } from './TopologyDiagram';

export const KafkaTopologyPage: React.FC = () => {
  const [allContexts, setAllContexts] = useState<any[]>([]);
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [graph, setGraph] = useState<KafkaTopologyGraph | null>(null);
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    const contextNames = [
      'payments', 'deposits', 'loan', 'creditcards', 'onboarding', 'customertransactions', 'iam'
    ];
    Promise.all(
      contextNames.map(async context => {
        const url = `/contracts/${context}/topics.yaml`;
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const text = await res.text();
          const topics = yaml.load(text);
          return { context, topics: Array.isArray(topics) ? topics : [topics] };
        } catch {
          return null;
        }
      })
    ).then(contextTopicsArr => {
      const contextTopics = contextTopicsArr.filter(Boolean);
      setAllContexts(contextTopics);
      // Default to first context
      if (contextTopics.length > 0) {
        setSelectedContext(contextTopics[0].context);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedContext || allContexts.length === 0) return;
    const ctxObj = allContexts.find(ctx => ctx.context === selectedContext);
    if (ctxObj) {
      setTopics(ctxObj.topics);
      setGraph(buildKafkaTopologyGraphFromContexts([ctxObj]));
    }
  }, [selectedContext, allContexts]);

  return (
    <div>
      <h2>Kafka Topology Diagram</h2>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="context-select"><strong>Bounded Context:</strong> </label>
        <select
          id="context-select"
          value={selectedContext}
          onChange={e => setSelectedContext(e.target.value)}
        >
          {allContexts.map(ctx => (
            <option key={ctx.context} value={ctx.context}>{ctx.context}</option>
          ))}
        </select>
      </div>
      {graph ? <TopologyDiagram graph={graph} topics={topics} /> : <div>Failed to load graph data.</div>}
    </div>
  );
};
