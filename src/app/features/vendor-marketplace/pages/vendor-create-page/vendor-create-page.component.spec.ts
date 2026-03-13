import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VendorCreatePageComponent } from './vendor-create-page.component';
import { VendorService } from '../../../../core/services/vendor.service';
import { of } from 'rxjs';

describe('VendorCreatePageComponent', () => {
  let component: VendorCreatePageComponent;
  let fixture: ComponentFixture<VendorCreatePageComponent>;
  let mockVendorService: jasmine.SpyObj<VendorService>;

  beforeEach(async () => {
    mockVendorService = jasmine.createSpyObj('VendorService', ['createVendor']);
    mockVendorService.createVendor.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      declarations: [ VendorCreatePageComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: VendorService, useValue: mockVendorService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
