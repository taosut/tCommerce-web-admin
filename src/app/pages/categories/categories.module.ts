import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { CategoryComponent } from './category/category.component';
import { CategoriesService } from './categories.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PreloaderModule } from '../../preloader/preloader.module';
import { CategoryProductItemSorterModalComponent } from './category-product-item-sorter-modal/category-product-item-sorter-modal.component';
import { ProductItemSorterModule } from '../../product-item-sorter/product-item-sorter.module';
import { QuillModule } from 'ngx-quill';
import { MediaAssetModule } from '../../media-asset/media-asset.module';
import { MediaUploaderModule } from '../../media-uploader/media-uploader.module';


@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    CategoryProductItemSorterModalComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PreloaderModule,
    ProductItemSorterModule,
    QuillModule,
    MediaAssetModule,
    MediaUploaderModule
  ],
  providers: [
    CategoriesService
  ]
})
export class CategoriesModule { }
