import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { Entity } from '@backstage/catalog-model';
import { Octokit } from '@octokit/rest';
import * as yaml from 'yaml';

export interface CentralConfigEntityProviderOptions {
  config: Config;
  logger: Logger;
  schedule?: {
    frequency: { minutes: number };
    timeout: { minutes: number };
  };
}

export class CentralConfigEntityProvider implements EntityProvider {
  private readonly config: Config;
  private readonly logger: Logger;
  private readonly schedule?: {
    frequency: { minutes: number };
    timeout: { minutes: number };
  };
  private connection?: EntityProviderConnection;
  private lastSyncTime?: Date;
  private lastSyncStatus?: 'success' | 'error';
  private lastSyncError?: string;

  constructor(options: CentralConfigEntityProviderOptions) {
    this.config = options.config;
    this.logger = options.logger;
    this.schedule = options.schedule;
  }

  getProviderName(): string {
    return 'CentralConfigEntityProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    
    // Initial sync
    await this.sync();

    // Setup periodic sync if schedule is configured
    if (this.schedule) {
      const intervalMs = this.schedule.frequency.minutes * 60 * 1000;
      setInterval(() => this.sync(), intervalMs);
    }
  }

  async sync(): Promise<void> {
    if (!this.connection) {
      this.logger.warn('Cannot sync: EntityProviderConnection not established');
      return;
    }

    try {
      this.logger.info('Starting sync from central config repository');
      
      const repoUrl = this.config.getOptionalString('centralConfig.repoUrl');
      const githubToken = this.config.getOptionalString('centralConfig.githubToken');
      
      if (!repoUrl) {
        this.logger.warn('No centralConfig.repoUrl configured, skipping sync');
        return;
      }

      const entities = await this.fetchEntities(repoUrl, githubToken);
      
      await this.connection.applyMutation({
        type: 'full',
        entities: entities.map(entity => ({
          entity,
          locationKey: `central-config:${repoUrl}`,
        })),
      });

      this.lastSyncTime = new Date();
      this.lastSyncStatus = 'success';
      this.lastSyncError = undefined;
      this.logger.info(`Successfully synced ${entities.length} entities from central config`);
    } catch (error) {
      this.lastSyncTime = new Date();
      this.lastSyncStatus = 'error';
      this.lastSyncError = error instanceof Error ? error.message : String(error);
      this.logger.error('Error syncing from central config', error);
    }
  }

  private async fetchEntities(repoUrl: string, githubToken?: string): Promise<Entity[]> {
    // Parse GitHub URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error(`Invalid GitHub URL: ${repoUrl}`);
    }

    const [, owner, repo] = match;
    const octokit = new Octokit({
      auth: githubToken,
    });

    const entities: Entity[] = [];

    try {
      // Fetch catalog-info.yaml files from the repository
      const { data: files } = await octokit.rest.repos.getContent({
        owner,
        repo: repo.replace(/\.git$/, ''),
        path: '',
      });

      if (!Array.isArray(files)) {
        return entities;
      }

      // Process each YAML file
      for (const file of files) {
        if (
          file.type === 'file' &&
          (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))
        ) {
          try {
            const { data: content } = await octokit.rest.repos.getContent({
              owner,
              repo: repo.replace(/\.git$/, ''),
              path: file.path,
            });

            if ('content' in content) {
              const decodedContent = Buffer.from(content.content, 'base64').toString('utf-8');
              const parsedYaml = yaml.parse(decodedContent);

              // Support both single entity and array of entities
              const entitiesToAdd = Array.isArray(parsedYaml) ? parsedYaml : [parsedYaml];
              
              for (const entity of entitiesToAdd) {
                if (this.isValidEntity(entity)) {
                  entities.push(entity as Entity);
                }
              }
            }
          } catch (error) {
            this.logger.warn(`Failed to process file ${file.path}`, error);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error fetching from GitHub', error);
      throw error;
    }

    return entities;
  }

  private isValidEntity(obj: any): boolean {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.apiVersion === 'string' &&
      typeof obj.kind === 'string' &&
      typeof obj.metadata === 'object' &&
      typeof obj.metadata.name === 'string'
    );
  }

  getSyncStatus(): {
    lastSyncTime?: Date;
    status?: 'success' | 'error';
    error?: string;
  } {
    return {
      lastSyncTime: this.lastSyncTime,
      status: this.lastSyncStatus,
      error: this.lastSyncError,
    };
  }
}
