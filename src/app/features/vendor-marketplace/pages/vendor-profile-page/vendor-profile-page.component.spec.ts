import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VendorProfilePageComponent } from './vendor-profile-page.component';
import { VendorService } from '../../../../core/services/vendor.service';
import { of } from 'rxjs';

describe('VendorProfilePageComponent', () => {
  let component: VendorProfilePageComponent;
  let fixture: ComponentFixture<VendorProfilePageComponent>;
  let mockVendorService: jasmine.SpyObj<VendorService>;

  beforeEach(async () => {
    mockVendorService = jasmine.createSpyObj('VendorService', ['getVendor', 'getStatusHistory', 'updateVendorStatus']);
    mockVendorService.getVendor.and.returnValue(of({} as any));
    mockVendorService.getStatusHistory.and.returnValue(of([]));
    mockVendorService.updateVendorStatus.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      declarations: [ VendorProfilePageComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: VendorService, useValue: mockVendorService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
