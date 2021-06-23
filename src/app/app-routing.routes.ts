import { Routes, CanActivate } from '@angular/router';
import { RouterAuthGuardService as AuthGuard } from './authentication/service/router-auth-guard.service';

import { InventoryHomeComponent } from './logistics/inventory/inventory-home/inventory-home.component';
import { CompanyListComponent } from './logistics/inventory/company-list/company-list.component';
import { CompanyDetailComponent } from './logistics/inventory/company-detail/company-detail.component';
import { PersonListComponent } from './logistics/inventory/person-list/person-list.component';
import { PersonDetailComponent } from './logistics/inventory/person-detail/person-detail.component';
import { ProductListComponent } from './logistics/inventory/product-list/product-list.component';
import { ProductDetailComponent } from './logistics/inventory/product-detail/product-detail.component';

import { HomeComponent } from './logistics/home/home.component';

export const routes: Routes = [
  { path: 'inventory',  component: InventoryHomeComponent, canActivate: [AuthGuard] },
  { path: 'inventory/companies', component: CompanyListComponent, canActivate: [AuthGuard] },
  { path: 'inventory/companies/:id', component: CompanyDetailComponent, canActivate: [AuthGuard] },
  { path: 'inventory/persons', component: PersonListComponent, canActivate: [AuthGuard] },
  { path: 'inventory/persons/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'inventory/products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'inventory/products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },

  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];