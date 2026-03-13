import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardSummaryResponse } from '../../../../models/dashboard-summary-response.model';
import { DashboardComponent } from './dashboard.component';

class DashboardServiceStub {
  private response: DashboardSummaryResponse = {
    status: 'success',
    data: {
      kpis: {
        totalVendorsOnboarded: 47,
        activeWidgets: 234,
        pendingWidgetApprovals: 8,
        leadsCaptured: 1847,
        asOf: new Date().toISOString(),
      },
      analytics: {
        impressionsVsClicks: [
          { timestamp: 'Jan', impressions: 100, clicks: 10 },
          { timestamp: 'Feb', impressions: 120, clicks: 12 },
        ],
        widgetPerformanceTrends: [],
        geographicEngagementDistribution: [],
        asOf: new Date().toISOString(),
      },
      activity: [
        {
          id: 'a1',
          eventType: 'vendor_onboarded',
          message: 'Vendor onboarded',
          occurredAt: new Date().toISOString(),
        },
      ],
    },
    meta: {
      timestamp: new Date().toISOString(),
      refreshIntervalSeconds: 60,
    },
  };

  streamSummary() {
    return of(this.response);
  }

  refreshNow() {
    return;
  }
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [{ provide: DashboardService, useClass: DashboardServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads KPI data on init', () => {
    expect(component.metrics?.activeWidgets).toBe(234);
    expect(component.viewState.kpiState).toBe('ready');
  });

  it('renders header and refresh button', () => {
    const header = fixture.debugElement.query(By.css('.dashboard-header h2'));
    const refreshBtn = fixture.debugElement.query(By.css('.refresh-btn'));
    expect(header.nativeElement.textContent).toContain('Platform Dashboard');
    expect(refreshBtn).toBeTruthy();
  });

  it('sets loading state on manual refresh', () => {
    component.onManualRefresh();
    expect(component.viewState.kpiState).toBe('loading');
    expect(component.viewState.analyticsState).toBe('loading');
    expect(component.viewState.activityState).toBe('loading');
  });
});
