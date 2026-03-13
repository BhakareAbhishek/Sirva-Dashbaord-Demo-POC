import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorFormComponent } from './vendor-form.component';
import { VendorService } from '../../../../core/services/vendor.service';
import { of } from 'rxjs';

describe('VendorFormComponent', () => {
  let component: VendorFormComponent;
  let fixture: ComponentFixture<VendorFormComponent>;
  let mockVendorService: jasmine.SpyObj<VendorService>;

  beforeEach(async () => {
    mockVendorService = jasmine.createSpyObj('VendorService', ['checkEmailAvailability']);
    mockVendorService.checkEmailAvailability.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [ VendorFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: VendorService, useValue: mockVendorService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
