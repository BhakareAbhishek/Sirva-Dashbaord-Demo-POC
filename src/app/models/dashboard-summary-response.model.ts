import { ActivityLog } from './activity-log.model';
import { AnalyticsData } from './analytics-data.model';
import { DashboardMetrics } from './dashboard-metrics.model';

export type DashboardStatus = 'success' | 'partial' | 'error';

export interface DashboardSummaryData {
  kpis: DashboardMetrics | null;
  analytics: AnalyticsData | null;
  activity: ActivityLog[] | null;
}

export interface DashboardSummaryMeta {
  timestamp: string;
  refreshIntervalSeconds: number;
  requestId?: string;
  partialSections?: Array<'kpis' | 'analytics' | 'activity'>;
}

export interface DashboardApiError {
  code: string;
  message: string;
}

export interface DashboardSummaryResponse {
  status: DashboardStatus;
  data: DashboardSummaryData | null;
  meta: DashboardSummaryMeta;
  error?: DashboardApiError;
}

export type SectionLoadState = 'loading' | 'ready' | 'error';

export interface DashboardViewState {
  kpiState: SectionLoadState;
  analyticsState: SectionLoadState;
  activityState: SectionLoadState;
  isManualRefreshInProgress: boolean;
  lastUpdatedAt: string | null;
  errorMessage: string | null;
}
