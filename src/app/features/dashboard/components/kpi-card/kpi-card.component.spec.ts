import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KpiCardComponent } from './kpi-card.component';

describe('KpiCardComponent', () => {
  let component: KpiCardComponent;
  let fixture: ComponentFixture<KpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    component.title = 'Active Widgets';
  });

  it('shows loading state when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('.kpi-loading'));
    expect(loadingEl).toBeTruthy();
  });

  it('shows error state when error message exists', () => {
    component.loading = false;
    component.errorMessage = 'Unable to load KPI';
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.kpi-error'));
    expect(errorEl.nativeElement.textContent).toContain('Unable to load KPI');
  });

  it('shows value when not loading and no error', () => {
    component.loading = false;
    component.value = 234;
    fixture.detectChanges();

    const valueEl = fixture.debugElement.query(By.css('.kpi-value'));
    expect(valueEl.nativeElement.textContent).toContain('234');
  });
});
