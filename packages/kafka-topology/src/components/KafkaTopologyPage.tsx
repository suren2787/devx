import React, { useEffect, useState } from 'react';
import type { GitHubConfig } from '../github/GitHubLoader';
import yaml from 'js-yaml';
import { buildKafkaTopologyGraphFromContexts, KafkaTopologyGraph } from '../buildGraph';
import { TopologyDiagram } from './TopologyDiagram';
import { GitHubTopicLoader } from '../github/GitHubLoader';

export const KafkaTopologyPage: React.FC = () => {
  const [allContexts, setAllContexts] = useState<any[]>([]);
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [graph, setGraph] = useState<KafkaTopologyGraph | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [topicFilter, setTopicFilter] = useState<string>('');

  // Add CSS for loading animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Support both Backstage and standalone modes
  let githubConfig: GitHubConfig;
  try {
    // Try Backstage config API (only available in Backstage)
    // @ts-ignore
    const { useConfig } = require('@backstage/core-plugin-api');
    const config = typeof useConfig === 'function' ? useConfig() : null;
    if (config) {
      const url = config.getOptionalString('kafkaTopology.contractsUrl') || '';
      const match = url.match(/github.com\/(.+?)\/(.+?)\/tree\/(.+?)\/(.+)/);
      githubConfig = {
        owner: match && match[1] ? match[1] : '',
        repo: match && match[2] ? match[2] : '',
        branch: match && match[3] ? match[3] : '',
        path: match && match[4] ? match[4] : '',
        token: config.getOptionalString('kafkaTopology.githubToken') || ''
      };
    }
  } catch (e) {
    // Fallback to environment variables for standalone mode
    githubConfig = {
      owner: import.meta.env.VITE_GITHUB_OWNER || '',
      repo: import.meta.env.VITE_GITHUB_REPO || '',
      branch: import.meta.env.VITE_GITHUB_BRANCH || '',
      path: import.meta.env.VITE_GITHUB_PATH || '',
      token: import.meta.env.VITE_GITHUB_TOKEN || ''
    };
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local files
  // ...existing code...

  // Load from GitHub using config from app-config.yaml
  const loadGitHubContexts = async () => {
    const loader = new GitHubTopicLoader(githubConfig);
    const files = await loader.fetchTopicFiles();
    return files.map(file => {
      try {
        const topics = yaml.load(file.content);
        return {
          context: file.context,
          topics: Array.isArray(topics) ? topics : [topics],
          source: 'github',
          path: file.path,
        };
      } catch (error) {
        console.error(`Failed to parse YAML for context ${file.context}:`, error);
        return null;
      }
    }).filter(Boolean);
  };

  // Load contexts based on configuration
  useEffect(() => {
    const loadContexts = async () => {
      setLoading(true);
      setError(null);
      try {
        const contextTopics = await loadGitHubContexts();
        setAllContexts(contextTopics);
        if (contextTopics.length > 0 && contextTopics[0]) {
          setSelectedContext(contextTopics[0].context);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contexts');
        console.error('Failed to load contexts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadContexts();
  }, []);

  useEffect(() => {
    if (!selectedContext || allContexts.length === 0) return;
    const ctxObj = allContexts.find(ctx => ctx.context === selectedContext);
    if (ctxObj) {
      let filteredTopics = ctxObj.topics;
      if (topicFilter.trim()) {
        filteredTopics = filteredTopics.filter((t: any) => t.name.toLowerCase().includes(topicFilter.trim().toLowerCase()));
      }
      setTopics(filteredTopics);
      setGraph(buildKafkaTopologyGraphFromContexts([{ ...ctxObj, topics: filteredTopics }]));
    }
  }, [selectedContext, allContexts, topicFilter]);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>🔗</div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>Kafka Topology</h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div style={{ 
            background: '#dbeafe', 
            color: '#1e40af', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            border: '1px solid #93c5fd',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid #93c5fd',
              borderTop: '2px solid #1e40af',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading contexts...
          </div>
        )}

        {/* Controls Section */}
        <div style={{ 
          background: '#f8fafc',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🏗️</span>
              <label htmlFor="context-select" style={{ fontWeight: '600', color: '#374151' }}>Context:</label>
              <select
                id="context-select"
                value={selectedContext}
                onChange={e => setSelectedContext(e.target.value)}
                disabled={loading}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontSize: '14px',
                  minWidth: '180px',
                  cursor: 'pointer'
                }}
              >
                {allContexts.length === 0 ? (
                  <option value="">No contexts loaded</option>
                ) : (
                  allContexts.map(ctx => (
                    <option key={ctx.context} value={ctx.context}>
                      {ctx.context}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🔍</span>
              <label htmlFor="topic-filter" style={{ fontWeight: '600', color: '#374151' }}>Filter:</label>
              <input
                id="topic-filter"
                type="text"
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
                placeholder="Search topics..."
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  minWidth: '200px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                disabled={loading}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
        </div>

        {/* Topology Diagram */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          minHeight: '600px'
        }}>
          {graph ? (
            <TopologyDiagram 
              graph={graph} 
              topics={topics} 
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              📊 No topology data available
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
