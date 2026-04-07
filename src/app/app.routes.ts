import { Routes } from '@angular/router';

import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { Home } from './features/home/home/home';

import { Login } from './features/admin/login/login';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { ProductForm } from './features/admin/product-form/product-form';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },

  { path: 'admin', component: Login },
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'admin/add-product', component: ProductForm },
  {
  path: 'about',
  loadComponent: () => import('./features/about-us/about-us')
    .then(m => m.AboutUsComponent)
},
 {
  path: 'contactus',
  loadComponent: () => import('./features/contactus/contactus')
    .then(m => m.Contactus)
}
];