import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivityLog } from '../../../../models/activity-log.model';

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityComponent {
  @Input() activities: ActivityLog[] = [];
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  trackByActivityId(_: number, activity: ActivityLog): string {
    return activity.id;
  }
}
