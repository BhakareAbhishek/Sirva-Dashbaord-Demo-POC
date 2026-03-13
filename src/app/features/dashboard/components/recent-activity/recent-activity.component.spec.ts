import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RecentActivityComponent } from './recent-activity.component';

describe('RecentActivityComponent', () => {
  let component: RecentActivityComponent;
  let fixture: ComponentFixture<RecentActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivityComponent);
    component = fixture.componentInstance;
  });

  it('shows empty message for no activities', () => {
    component.loading = false;
    component.activities = [];
    fixture.detectChanges();

    const emptyEl = fixture.debugElement.query(By.css('p'));
    expect(emptyEl.nativeElement.textContent).toContain('No recent activity available');
  });

  it('shows activity items', () => {
    component.loading = false;
    component.activities = [
      {
        id: 'a1',
        eventType: 'vendor_onboarded',
        message: 'Vendor onboarded',
        occurredAt: new Date().toISOString(),
      },
    ];
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('li'));
    expect(listItems.length).toBe(1);
  });

  it('shows error when provided', () => {
    component.loading = false;
    component.errorMessage = 'Unable to load activity';
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error'));
    expect(errorEl.nativeElement.textContent).toContain('Unable to load activity');
  });
});
