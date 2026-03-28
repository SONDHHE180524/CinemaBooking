import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageSystemComponent } from './manage-system/manage-system.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'system', component: ManageSystemComponent },
      { path: 'users', component: ManageUsersComponent }
    ]
  }
];
