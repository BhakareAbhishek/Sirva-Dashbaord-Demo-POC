import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VendorEditPageComponent } from './vendor-edit-page.component';
import { VendorService } from '../../../../core/services/vendor.service';
import { of } from 'rxjs';

describe('VendorEditPageComponent', () => {
  let component: VendorEditPageComponent;
  let fixture: ComponentFixture<VendorEditPageComponent>;
  let mockVendorService: jasmine.SpyObj<VendorService>;

  beforeEach(async () => {
    mockVendorService = jasmine.createSpyObj('VendorService', ['getVendor', 'updateVendor']);
    mockVendorService.getVendor.and.returnValue(of({} as any));
    mockVendorService.updateVendor.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      declarations: [ VendorEditPageComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: VendorService, useValue: mockVendorService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
