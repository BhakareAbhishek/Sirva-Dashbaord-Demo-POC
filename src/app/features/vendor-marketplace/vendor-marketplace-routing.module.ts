import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorListPageComponent } from './pages/vendor-list-page/vendor-list-page.component';
import { VendorCreatePageComponent } from './pages/vendor-create-page/vendor-create-page.component';
import { VendorEditPageComponent } from './pages/vendor-edit-page/vendor-edit-page.component';
import { VendorProfilePageComponent } from './pages/vendor-profile-page/vendor-profile-page.component';

/**
 * Vendor Marketplace Routing Configuration
 * 
 * Routes:
 * - /vendors - Vendor list with search and filtering
 * - /vendors/create - Vendor onboarding form
 * - /vendors/:id - Vendor profile view
 * - /vendors/:id/edit - Vendor profile edit form
 * 
 * Note: UnsavedChangesGuard should be added to create and edit routes
 * when the guard is implemented.
 */
const routes: Routes = [
  {
    path: '',
    component: VendorListPageComponent,
    data: { title: 'Vendor Marketplace' }
  },
  {
    path: 'create',
    component: VendorCreatePageComponent,
    data: { title: 'Create Vendor' }
    // TODO: Add canDeactivate: [UnsavedChangesGuard] after guard implementation
  },
  {
    path: ':id',
    component: VendorProfilePageComponent,
    data: { title: 'Vendor Profile' }
  },
  {
    path: ':id/edit',
    component: VendorEditPageComponent,
    data: { title: 'Edit Vendor' }
    // TODO: Add canDeactivate: [UnsavedChangesGuard] after guard implementation
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorMarketplaceRoutingModule { }
