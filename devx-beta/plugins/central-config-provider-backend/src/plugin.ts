import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { createRouter } from './router';
import { CentralConfigEntityProvider } from './providers/CentralConfigEntityProvider';

/**
 * centralConfigProviderPlugin backend plugin
 *
 * @public
 */
export const centralConfigProviderPlugin = createBackendPlugin({
  pluginId: 'central-config-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
      },
      async init({ catalog, config, logger, httpAuth, httpRouter }) {
        // Get refresh interval from config (default to 10 minutes)
        const refreshMinutes = config.getOptionalNumber('centralConfig.refreshInterval') || 10;
        
        // Create entity provider
        const entityProvider = new CentralConfigEntityProvider({
          config,
          logger,
          schedule: {
            frequency: { minutes: refreshMinutes },
            timeout: { minutes: 5 },
          },
        });

        // Register entity provider with catalog
        catalog.addEntityProvider(entityProvider);

        // Setup HTTP router
        httpRouter.use(
          await createRouter({
            httpAuth,
            entityProvider,
          }),
        );

        logger.info('Central Config Provider plugin initialized');
      },
    });
  },
});
