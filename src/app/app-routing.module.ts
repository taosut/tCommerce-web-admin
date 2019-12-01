import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EPageAction } from './shared/enums/category-page-action.enum';


const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      }, {
        path: 'order',
        loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./pages/product-list/product-list.module').then(m => m.ProductListModule)
      },
      {
        path: 'product/add',
        loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule),
        data: {
          action: EPageAction.Add
        }
      },
      {
        path: 'product/edit/:id',
        loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule),
        data: {
          action: EPageAction.Edit
        }
      },
      {
        path: 'attribute',
        loadChildren: () => import('./pages/attribute-list/attribute-list.module').then(m => m.AttributeListModule)
      },
      {
        path: 'attribute/add',
        loadChildren: () => import('./pages/attribute/attribute.module').then(m => m.AttributeModule),
        data: {
          action: EPageAction.Add
        }
      },
      {
        path: 'attribute/edit/:id',
        loadChildren: () => import('./pages/attribute/attribute.module').then(m => m.AttributeModule),
        data: {
          action: EPageAction.Edit
        }
      },
      {
        path: '**',
        loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'corrected',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
