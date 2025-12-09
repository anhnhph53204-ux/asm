import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Cart } from './pages/cart/cart';
import { CategoryComponent } from './pages/category/category';
import { Admin } from './pages/admin/admin';
import { SearchComponent } from './pages/search/search';
import { DetailComponent } from './pages/detail/detail';
import { ProductComponent } from './pages/product/product';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'cart', component: Cart },
  { path: 'admin', component: Admin },
  { path: 'search', component:SearchComponent },
  { path: 'product/:id', component: DetailComponent },
  { path: 'product', component: ProductComponent },
  { path: '**', redirectTo: '' },
];
