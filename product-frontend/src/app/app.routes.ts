import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductList } from './components/product-list/product-list';
import { ProductForm } from './components/product-form/product-form';
import { CategoryForm } from './category-form/category-form';

export const routes: Routes = [
   {path:'', component: Home},
   { path: 'products', component: ProductList },
   { path: 'categories', component: CategoryForm },
   {path:'add-product', component:ProductForm},
   {path:'edit-product/:id', component:ProductForm},
   {path:'**', redirectTo:'',pathMatch:'full'}
];
