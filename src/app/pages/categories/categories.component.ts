import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from './categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CategoryTreeItem, ResponseCategoryDto } from '../../shared/dtos/category.dto';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: CategoryTreeItem[];
  ngUnsubscribe = new Subject();

  constructor(private categoriesService: CategoriesService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.fetchCategoriesTree();
    this.categoriesService.categoryUpdated$.subscribe(_ => this.fetchCategoriesTree());
  }

  ngOnDestroy(): void {
    this.categoriesService.removeSelectedCategoryId();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  fetchCategoriesTree() {
    this.categoriesService.fetchCategoriesTree().subscribe(
      tree => {
        this.categories = tree.categories;
      },
      error => console.warn(error)
    );
  }

  selectCategory(category: ResponseCategoryDto) {
    this.categoriesService.setSelectedCategoryId(category.id);
    this.router.navigate(['edit', category.id], { relativeTo: this.route });
  }

  addRootCategory() {
    this.addCategory(0);
  }

  addSubCategory() {
    this.addCategory(this.categoriesService.selectedCategoryId);
  }

  private addCategory(id: string | number) {
    this.categoriesService.removeSelectedCategoryId();
    this.router.navigate(['add', 'parent', id], { relativeTo: this.route });
  }
}
