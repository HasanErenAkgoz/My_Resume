import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Hasan Eren Akgöz — Full Stack Developer · AI Integration',
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/privacy/privacy.component').then((m) => m.PrivacyComponent),
    title: 'Privacy Policy — Hasan Eren Akgöz',
  },
  { path: '**', redirectTo: '' },
];
