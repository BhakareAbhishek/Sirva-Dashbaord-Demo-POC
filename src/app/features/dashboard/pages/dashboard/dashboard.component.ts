import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { ActivityLog } from '../../../../models/activity-log.model';
import { AnalyticsData } from '../../../../models/analytics-data.model';
import { DashboardMetrics } from '../../../../models/dashboard-metrics.model';
import {
  DashboardSummaryData,
  DashboardSummaryResponse,
  DashboardViewState,
} from '../../../../models/dashboard-summary-response.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  metrics: DashboardMetrics | null = null;
  analytics: AnalyticsData | null = null;
  activity: ActivityLog[] = [];

  viewState: DashboardViewState = {
    kpiState: 'loading',
    analyticsState: 'loading',
    activityState: 'loading',
    isManualRefreshInProgress: false,
    lastUpdatedAt: null,
    errorMessage: null,
  };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService
      .streamSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => this.handleSummaryResponse(response));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onManualRefresh(): void {
    this.viewState = {
      ...this.viewState,
      isManualRefreshInProgress: true,
      kpiState: 'loading',
      analyticsState: 'loading',
      activityState: 'loading',
      errorMessage: null,
    };
    this.cdr.markForCheck();
    this.dashboardService.refreshNow();
  }

  sectionError(section: 'kpi' | 'analytics' | 'activity'): string | null {
    const state =
      section === 'kpi'
        ? this.viewState.kpiState
        : section === 'analytics'
        ? this.viewState.analyticsState
        : this.viewState.activityState;

    return state === 'error' ? this.viewState.errorMessage : null;
  }

  private handleSummaryResponse(response: DashboardSummaryResponse): void {
    const data = response.data;
    const message = response.error?.message ?? null;

    if (data) {
      this.patchData(data);
    }

    if (response.status === 'error') {
      this.viewState = {
        ...this.viewState,
        kpiState: this.metrics ? 'ready' : 'error',
        analyticsState: this.analytics ? 'ready' : 'error',
        activityState: this.activity.length > 0 ? 'ready' : 'error',
        isManualRefreshInProgress: false,
        errorMessage: message,
      };
      this.cdr.markForCheck();
      return;
    }

    const partialSections = new Set(response.meta.partialSections ?? []);
    this.viewState = {
      ...this.viewState,
      kpiState: partialSections.has('kpis') ? 'error' : 'ready',
      analyticsState: partialSections.has('analytics') ? 'error' : 'ready',
      activityState: partialSections.has('activity') ? 'error' : 'ready',
      isManualRefreshInProgress: false,
      lastUpdatedAt: response.meta.timestamp,
      errorMessage: partialSections.size > 0 ? 'Some sections failed to refresh. Retry to update.' : null,
    };
    this.cdr.markForCheck();
  }

  private patchData(data: DashboardSummaryData): void {
    if (data.kpis) {
      this.metrics = data.kpis;
    }
    if (data.analytics) {
      this.analytics = data.analytics;
    }
    if (data.activity) {
      this.activity = [...data.activity].sort((a, b) =>
        a.occurredAt > b.occurredAt ? -1 : 1
      );
    }
  }
}
