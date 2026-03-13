import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorStatusToggleComponent } from './vendor-status-toggle.component';

describe('VendorStatusToggleComponent', () => {
  let component: VendorStatusToggleComponent;
  let fixture: ComponentFixture<VendorStatusToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorStatusToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorStatusToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
