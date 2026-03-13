import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  merge,
  of,
  timer,
} from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';
import { DashboardServiceError } from '../models/dashboard-error.model';
import {
  DashboardSummaryData,
  DashboardSummaryResponse,
} from '../../models/dashboard-summary-response.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly endpoint = '/api/dashboard/summary';
  private readonly requestTimeoutMs = 10000;
  private readonly autoRefreshMs = 60000;

  private readonly manualRefreshSubject = new Subject<void>();
  private readonly lastSuccessfulDataSubject =
    new BehaviorSubject<DashboardSummaryData | null>(null);

  constructor(private readonly http: HttpClient) {}

  streamSummary(): Observable<DashboardSummaryResponse> {
    return merge(timer(0, this.autoRefreshMs), this.manualRefreshSubject).pipe(
      switchMap(() => this.fetchSummary())
    );
  }

  refreshNow(): void {
    this.manualRefreshSubject.next();
  }

  getLastSuccessfulData(): Observable<DashboardSummaryData | null> {
    return this.lastSuccessfulDataSubject.asObservable();
  }

  fetchSummary(): Observable<DashboardSummaryResponse> {
    return this.http.get<DashboardSummaryResponse>(this.endpoint).pipe(
      timeout(this.requestTimeoutMs),
      tap((response: DashboardSummaryResponse) => {
        if (
          (response.status === 'success' || response.status === 'partial') &&
          response.data
        ) {
          this.lastSuccessfulDataSubject.next(response.data);
        }
      }),
      catchError((error: unknown) => of(this.toErrorResponse(error)))
    );
  }

  private toErrorResponse(error: unknown): DashboardSummaryResponse {
    const serviceError = this.toServiceError(error);
    const fallbackData = this.lastSuccessfulDataSubject.getValue();
    const demoFallbackData = fallbackData ?? this.getDemoData();

    return {
      status: 'error',
      data: demoFallbackData,
      meta: {
        timestamp: new Date().toISOString(),
        refreshIntervalSeconds: this.autoRefreshMs / 1000,
      },
      error: {
        code: serviceError.isTimeout
          ? 'DASHBOARD_TIMEOUT'
          : 'DASHBOARD_FETCH_FAILED',
        message: serviceError.message,
      },
    };
  }

  private toServiceError(error: unknown): DashboardServiceError {
    const isTimeout =
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name: string }).name === 'TimeoutError';

    return {
      isTimeout,
      message: isTimeout
        ? 'Dashboard request timed out. Please retry.'
        : 'Unable to load dashboard data. Please try again.',
    };
  }

  // Development fallback for local UI preview when backend is unavailable.
  private getDemoData(): DashboardSummaryData {
    return {
      kpis: {
        totalVendorsOnboarded: 47,
        activeWidgets: 234,
        pendingWidgetApprovals: 8,
        leadsCaptured: 1847,
        asOf: new Date().toISOString(),
      },
      analytics: {
        impressionsVsClicks: [
          { timestamp: 'Jan', impressions: 46000, clicks: 12000 },
          { timestamp: 'Feb', impressions: 52000, clicks: 13800 },
          { timestamp: 'Mar', impressions: 49000, clicks: 13100 },
          { timestamp: 'Apr', impressions: 62000, clicks: 15600 },
          { timestamp: 'May', impressions: 57000, clicks: 14900 },
          { timestamp: 'Jun', impressions: 68000, clicks: 16200 },
        ],
        widgetPerformanceTrends: [
          {
            widgetId: 'expat-services',
            widgetName: 'Destination Services',
            trendPoints: [{ timestamp: 'w6', value: 86 }],
          },
          {
            widgetId: 'moving-storage',
            widgetName: 'Moving & Storage',
            trendPoints: [{ timestamp: 'w6', value: 78 }],
          },
          {
            widgetId: 'home-sale',
            widgetName: 'Home Sale',
            trendPoints: [{ timestamp: 'w6', value: 64 }],
          },
        ],
        geographicEngagementDistribution: [
          { regionCode: 'NA', regionName: 'North America', engagementCount: 185000 },
          { regionCode: 'EU', regionName: 'Europe', engagementCount: 92000 },
          { regionCode: 'APAC', regionName: 'Asia Pacific', engagementCount: 67000 },
          { regionCode: 'LATAM', regionName: 'Latin America', engagementCount: 34000 },
          { regionCode: 'MEA', regionName: 'Middle East', engagementCount: 21000 },
        ],
        asOf: new Date().toISOString(),
      },
      activity: [
        {
          id: 'a1',
          eventType: 'vendor_onboarded',
          message: 'Sirva Mobility Vendor onboarded successfully',
          occurredAt: new Date().toISOString(),
          actorName: 'Admin User',
        },
        {
          id: 'a2',
          eventType: 'widget_approved',
          message: 'Performance Trends widget approved for publication',
          occurredAt: new Date(Date.now() - 3600000).toISOString(),
          actorName: 'Governance Team',
        },
        {
          id: 'a3',
          eventType: 'lead_captured',
          message: 'New lead captured from Geography Campaign',
          occurredAt: new Date(Date.now() - 7200000).toISOString(),
          actorName: 'System',
        },
      ],
    };
  }
}
