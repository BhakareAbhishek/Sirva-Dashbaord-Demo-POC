export interface TimeSeriesPoint {
  timestamp: string;
  impressions: number;
  clicks: number;
}

export interface TrendPoint {
  timestamp: string;
  value: number;
}

export interface WidgetTrend {
  widgetId: string;
  widgetName: string;
  trendPoints: TrendPoint[];
}

export interface GeoEngagementPoint {
  regionCode: string;
  regionName: string;
  engagementCount: number;
}

export interface AnalyticsData {
  impressionsVsClicks: TimeSeriesPoint[];
  widgetPerformanceTrends: WidgetTrend[];
  geographicEngagementDistribution: GeoEngagementPoint[];
  asOf: string;
}
