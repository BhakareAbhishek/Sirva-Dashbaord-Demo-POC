import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VendorListPageComponent } from './vendor-list-page.component';
import { VendorService } from '../../../../core/services/vendor.service';
import { of } from 'rxjs';

describe('VendorListPageComponent', () => {
  let component: VendorListPageComponent;
  let fixture: ComponentFixture<VendorListPageComponent>;
  let mockVendorService: jasmine.SpyObj<VendorService>;

  beforeEach(async () => {
    mockVendorService = jasmine.createSpyObj('VendorService', ['listVendors']);
    mockVendorService.listVendors.and.returnValue(of({ vendors: [], pagination: { currentPage: 1, pageSize: 20, totalItems: 0, totalPages: 0, hasNext: false, hasPrevious: false } }));

    await TestBed.configureTestingModule({
      declarations: [ VendorListPageComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: VendorService, useValue: mockVendorService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
