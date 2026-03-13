import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AnalyticsChartComponent } from './analytics-chart.component';

describe('AnalyticsChartComponent', () => {
  let component: AnalyticsChartComponent;
  let fixture: ComponentFixture<AnalyticsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsChartComponent);
    component = fixture.componentInstance;
  });

  it('shows loading skeleton when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('.skeleton-wrap'));
    expect(skeleton).toBeTruthy();
  });

  it('returns chart data for valid time-series', () => {
    const chartData = component.toChartData([
      { timestamp: 'Jan', impressions: 100, clicks: 10 },
      { timestamp: 'Feb', impressions: 200, clicks: 20 },
    ]);

    expect(chartData.labels?.length).toBe(2);
    expect(chartData.datasets.length).toBe(2);
  });

  it('returns bounded geo width', () => {
    const width = component.geoWidth(
      { regionCode: 'NA', regionName: 'North America', engagementCount: 10 },
      [{ regionCode: 'NA', regionName: 'North America', engagementCount: 100 }]
    );

    expect(width).toContain('%');
  });
});
