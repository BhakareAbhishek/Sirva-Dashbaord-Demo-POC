import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorSearchFilterComponent } from './vendor-search-filter.component';

describe('VendorSearchFilterComponent', () => {
  let component: VendorSearchFilterComponent;
  let fixture: ComponentFixture<VendorSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSearchFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
