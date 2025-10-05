
import { Header, Page, Content } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { SyncStatusCard } from '../SyncStatusCard';

export const SyncStatusPage = () => {
  return (
    <Page themeId="tool">
      <Header title="Central Config Sync Status" subtitle="Monitor and manage entity synchronization" />
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <SyncStatusCard />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
