export interface GitHubConfig {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
  token?: string;
}

export interface GitHubTopicFile {
  context: string;
  content: string;
  path: string;
}

export class GitHubTopicLoader {
  private config: GitHubConfig;
  private baseUrl: string;

  constructor(config: GitHubConfig) {
    this.config = { ...config };
    this.baseUrl = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (this.config.token) {
      headers['Authorization'] = `token ${this.config.token}`;
    }
    
    return headers;
  }

  /**
   * Fetch all topic files from GitHub repository
   */
  async fetchTopicFiles(): Promise<GitHubTopicFile[]> {
    try {
      // Get directory contents
      const contentsUrl = `${this.baseUrl}/contents/${this.config.path}?ref=${this.config.branch}`;
      const response = await fetch(contentsUrl, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const contents = await response.json();
      
      if (!Array.isArray(contents)) {
        throw new Error('Expected directory contents but got single file');
      }

      // Filter for directories (bounded contexts)
      const contextDirs = contents.filter((item: any) => item.type === 'dir');
      
      // Fetch topics.yaml from each context directory
      const topicFiles: GitHubTopicFile[] = [];
      
      for (const dir of contextDirs) {
        const topicsUrl = `${this.baseUrl}/contents/${this.config.path}/${dir.name}/topics.yaml?ref=${this.config.branch}`;
        console.log(`[GitHubLoader] Fetching topics for context '${dir.name}': ${topicsUrl}`);
        try {
          const topicsResponse = await fetch(topicsUrl, {
            headers: this.getHeaders(),
          });

          if (topicsResponse.ok) {
            const topicsData = await topicsResponse.json();
            // Decode base64 content
            const content = atob(topicsData.content);
            topicFiles.push({
              context: dir.name,
              content,
              path: `${this.config.path}/${dir.name}/topics.yaml`,
            });
          } else {
            console.warn(`[GitHubLoader] topics.yaml not found for context '${dir.name}' (status ${topicsResponse.status}): ${topicsUrl}`);
          }
        } catch (error) {
          console.warn(`[GitHubLoader] Error fetching topics for context '${dir.name}':`, error);
        }
      }

      return topicFiles;
    } catch (error) {
      console.error('Failed to fetch GitHub topic files:', error);
      throw error;
    }
  }

  /**
   * Fetch topics for a specific context
   */
  async fetchContextTopics(context: string): Promise<GitHubTopicFile | null> {
    try {
      const topicsUrl = `${this.baseUrl}/contents/${this.config.path}/${context}/topics.yaml?ref=${this.config.branch}`;
      const response = await fetch(topicsUrl, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const content = atob(data.content);
      
      return {
        context,
        content,
        path: `${this.config.path}/${context}/topics.yaml`,
      };
    } catch (error) {
      console.warn(`Failed to fetch topics for context ${context}:`, error);
      return null;
    }
  }
}