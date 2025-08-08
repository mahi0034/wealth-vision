import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'content', loadComponent: () => import('./components/content-library/content-library.component').then(c => c.ContentLibraryComponent) },
  { path: 'insights', loadComponent: () => import('./components/client-insights/client-insights.component').then(c => c.ClientInsightsComponent) },
  { path: 'creator', loadComponent: () => import('./components/content-creator/content-creator.component').then(c => c.ContentCreatorComponent) },
  { path: 'preferences', loadComponent: () => import('./components/preferences/preferences.component').then(c => c.PreferencesComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
