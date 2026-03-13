import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AnalyticsData,
  GeoEngagementPoint,
  TimeSeriesPoint,
} from '../../../../models/analytics-data.model';

@Component({
  selector: 'app-analytics-chart',
  templateUrl: './analytics-chart.component.html',
  styleUrls: ['./analytics-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsChartComponent {
  @Input() analytics: AnalyticsData | null = null;
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  getLinePoints(data: TimeSeriesPoint[] | undefined, mode: 'impressions' | 'clicks'): string {
    if (!data || data.length === 0) {
      return '';
    }

    const values = data.map((item) =>
      mode === 'impressions' ? item.impressions : item.clicks
    );
    const maxValue = Math.max(...values, 1);
    const width = 720;
    const height = 220;
    const step = data.length > 1 ? width / (data.length - 1) : width;

    return values
      .map((value, index) => {
        const x = Math.round(index * step);
        const y = Math.round(height - (value / maxValue) * (height - 14) - 7);
        return `${x},${y}`;
      })
      .join(' ');
  }

  geoWidth(item: GeoEngagementPoint, data: GeoEngagementPoint[] | undefined): string {
    if (!data || data.length === 0) {
      return '0%';
    }
    const maxValue = Math.max(...data.map((entry) => entry.engagementCount), 1);
    const width = (item.engagementCount / maxValue) * 100;
    return `${Math.max(width, 8)}%`;
  }
}
