import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: number | null = null;
  @Input() loading = false;
  @Input() errorMessage: string | null = null;
  @Input() updatedAt: string | null = null;
}
