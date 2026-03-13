import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorMarketplaceRoutingModule } from './vendor-marketplace-routing.module';

// Page Components
import { VendorListPageComponent } from './pages/vendor-list-page/vendor-list-page.component';
import { VendorCreatePageComponent } from './pages/vendor-create-page/vendor-create-page.component';
import { VendorEditPageComponent } from './pages/vendor-edit-page/vendor-edit-page.component';
import { VendorProfilePageComponent } from './pages/vendor-profile-page/vendor-profile-page.component';

// Presentational Components
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { VendorFormComponent } from './components/vendor-form/vendor-form.component';
import { VendorProfileComponent } from './components/vendor-profile/vendor-profile.component';
import { VendorStatusToggleComponent } from './components/vendor-status-toggle/vendor-status-toggle.component';
import { VendorSearchFilterComponent } from './components/vendor-search-filter/vendor-search-filter.component';

/**
 * VendorMarketplaceModule
 * 
 * Feature module for vendor management functionality including:
 * - Vendor onboarding and profile management
 * - Vendor listing with search and filtering
 * - Vendor status control and audit trail
 * - WCAG 2.1 Level AA accessible UI components
 * 
 * This module is lazy-loaded via the app routing configuration.
 */
@NgModule({
  declarations: [
    // Page Components (Smart/Container)
    VendorListPageComponent,
    VendorCreatePageComponent,
    VendorEditPageComponent,
    VendorProfilePageComponent,
    
    // Presentational Components
    VendorListComponent,
    VendorFormComponent,
    VendorProfileComponent,
    VendorStatusToggleComponent,
    VendorSearchFilterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VendorMarketplaceRoutingModule
  ]
})
export class VendorMarketplaceModule { }
