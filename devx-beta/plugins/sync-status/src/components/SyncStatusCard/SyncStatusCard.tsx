import { useEffect, useState } from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import HelpIcon from '@material-ui/icons/Help';

interface SyncStatus {
  lastSyncTime?: string;
  status: 'success' | 'error' | 'unknown';
  error?: string;
}

export const SyncStatusCard = () => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/central-config-provider/sync-status`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch sync status');
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/central-config-provider/sync`,
        {
          method: 'POST',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to trigger sync');
      }
      // Wait a moment for the sync to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchStatus();
    } catch (err) {
      setError(err as Error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const getStatusIcon = () => {
    switch (status?.status) {
      case 'success':
        return <CheckCircleIcon style={{ color: 'green' }} />;
      case 'error':
        return <ErrorIcon style={{ color: 'red' }} />;
      default:
        return <HelpIcon style={{ color: 'gray' }} />;
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case 'success':
        return 'primary';
      case 'error':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Never';
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <InfoCard title="Central Config Sync Status">
        <CardContent>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Box marginRight={1}>{getStatusIcon()}</Box>
            <Chip
              label={status?.status?.toUpperCase() || 'UNKNOWN'}
              color={getStatusColor()}
            />
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body2" color="textSecondary">
              Last Sync Time
            </Typography>
            <Typography variant="body1">
              {formatTime(status?.lastSyncTime)}
            </Typography>
          </Box>

          {status?.error && (
            <Box marginBottom={2}>
              <Alert severity="error">
                <Typography variant="body2">
                  <strong>Error:</strong> {status.error}
                </Typography>
              </Alert>
            </Box>
          )}

          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={triggerSync}
              disabled={refreshing}
            >
              {refreshing ? 'Syncing...' : 'Trigger Sync'}
            </Button>
          </Box>
        </CardContent>
      </InfoCard>
    </Card>
  );
};
