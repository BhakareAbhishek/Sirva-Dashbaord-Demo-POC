import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService],
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps success response and stores last successful data', () => {
    let actualStatus = '';
    service.fetchSummary().subscribe((response) => {
      actualStatus = response.status;
      expect(response.data?.kpis?.activeWidgets).toBe(234);
    });

    const req = httpMock.expectOne('/api/dashboard/summary');
    req.flush({
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
          impressionsVsClicks: [{ timestamp: 'Jan', impressions: 100, clicks: 10 }],
          widgetPerformanceTrends: [],
          geographicEngagementDistribution: [],
          asOf: new Date().toISOString(),
        },
        activity: [],
      },
      meta: {
        timestamp: new Date().toISOString(),
        refreshIntervalSeconds: 60,
      },
    });

    expect(actualStatus).toBe('success');
  });

  it('returns error envelope when API fails', () => {
    service.fetchSummary().subscribe((response) => {
      expect(response.status).toBe('error');
      expect(response.error?.code).toBe('DASHBOARD_FETCH_FAILED');
      expect(response.data).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/dashboard/summary');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });

  it('maps timeout-like error to timeout code', () => {
    const timeoutError = { name: 'TimeoutError' } as unknown;
    const response = (service as unknown as { toErrorResponse: (e: unknown) => { error?: { code?: string } } })
      .toErrorResponse(timeoutError);

    expect(response.error?.code).toBe('DASHBOARD_TIMEOUT');
  });

  it('handles partial payload', () => {
    service.fetchSummary().subscribe((response) => {
      expect(response.status).toBe('partial');
      expect(response.meta.partialSections?.includes('analytics')).toBeTrue();
    });

    const req = httpMock.expectOne('/api/dashboard/summary');
    req.flush({
      status: 'partial',
      data: {
        kpis: {
          totalVendorsOnboarded: 47,
          activeWidgets: 234,
          pendingWidgetApprovals: 8,
          leadsCaptured: 1847,
          asOf: new Date().toISOString(),
        },
        analytics: null,
        activity: [],
      },
      meta: {
        timestamp: new Date().toISOString(),
        refreshIntervalSeconds: 60,
        partialSections: ['analytics'],
      },
    });
  });
});
