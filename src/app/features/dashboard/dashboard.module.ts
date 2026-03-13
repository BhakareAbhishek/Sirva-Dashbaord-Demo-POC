import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AnalyticsChartComponent } from './components/analytics-chart/analytics-chart.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    KpiCardComponent,
    AnalyticsChartComponent,
    RecentActivityComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
