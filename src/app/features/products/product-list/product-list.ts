import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../shared/product-card/product-card';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard, FormsModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {

  products: Product[] = [];
  expandedSubCategory: string | null = null;
  categoryTree: any = {};

  categories: string[] = [];

  selectedCategory: string = '';
  selectedSubCategory: string = '';

  expandedCategory: string | null = null;

  searchText: string = '';
  sortOption: string = 'default';

  filteredProducts: Product[] = [];

  objectKeys = Object.keys;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {

    this.productService.getProducts().subscribe({

      next: (products) => {

        this.products = products;

        // BUILD TREE
        this.categoryTree = this.buildCategoryTree(products);

        this.categories = Object.keys(this.categoryTree);

        // DEFAULT CATEGORY
        const savedCategory =
          sessionStorage.getItem('category');

        if (
          savedCategory &&
          this.categories.includes(savedCategory)
        ) {

          this.selectedCategory = savedCategory;

        } else {

          this.selectedCategory = this.categories[0];

        }

        // DEFAULT SUBCATEGORY
        const firstSubCategory = Object.keys(
          this.categoryTree[this.selectedCategory]
        )[0];

        this.selectedSubCategory = firstSubCategory;

        // SIDEBAR
        this.expandedCategory = this.selectedCategory;

        // FILTER
        this.applyFilters();

        // SCROLL RESTORE
        const lastId =
          sessionStorage.getItem('lastProductId');

        if (lastId) {

          setTimeout(() => {

            const el = document.getElementById(
              'product-' + lastId
            );

            if (el) {

              const y =
                el.getBoundingClientRect().top +
                window.scrollY -
                100;

              window.scrollTo({
                top: y,
                behavior: 'smooth'
              });

            }

          }, 300);

        }

      }

    });

  }

  // =========================
  // CATEGORY TREE
  // =========================
  buildCategoryTree(products: Product[]) {

    const tree: any = {};

    products.forEach((product: any) => {

      const parent =
        product.parentCategory ||
        product.category;

      const sub =
        product.subCategory ||
        product.category;

      if (!tree[parent]) {
        tree[parent] = {};
      }

      if (!tree[parent][sub]) {
        tree[parent][sub] = [];
      }

      tree[parent][sub].push(product);

    });

    return tree;

  }

  // =========================
  // CATEGORY SELECT
  // =========================
selectCategory(cat: string) {

  this.selectedCategory = cat;

  // ALWAYS EXPAND SELECTED CATEGORY
  this.expandedCategory = cat;

  // AUTO SELECT FIRST SUBCATEGORY
  const firstSubCategory = Object.keys(
    this.categoryTree[cat]
  )[0];

  this.selectedSubCategory = firstSubCategory;

  this.applyFilters();

}

  // =========================
  // SUBCATEGORY SELECT
  // =========================
selectSubCategory(sub: string) {

  this.selectedSubCategory = sub;

  // TOGGLE PRODUCT LIST
  this.expandedSubCategory =
    this.expandedSubCategory === sub
      ? null
      : sub;

  this.applyFilters();

}

  // =========================
  // FILTERS
  // =========================
applyFilters() {

  if (
    !this.selectedCategory ||
    !this.selectedSubCategory
  ) {
    return;
  }

  // GET PRODUCTS FROM SUBCATEGORY
  let products =
    this.categoryTree?.[
      this.selectedCategory
    ]?.[
      this.selectedSubCategory
    ] || [];

  // SEARCH
  if (this.searchText) {

    products = products.filter((p: any) =>
      p.name
        .toLowerCase()
        .includes(
          this.searchText.toLowerCase()
        )
    );

  }

  // SORT ASC
  if (this.sortOption === 'name-asc') {

    products = [...products].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  }

  // SORT DESC
  if (this.sortOption === 'name-desc') {

    products = [...products].sort((a, b) =>
      b.name.localeCompare(a.name)
    );

  }

  this.filteredProducts = products;

}

  // =========================
  // SIDEBAR TOGGLE
  // =========================


  // =========================
  // FORMAT LABEL
  // =========================
  formatLabel(label: string): string {

    return label
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c =>
        c.toUpperCase()
      );

  }

  // =========================
  // PRODUCT CLICK
  // =========================
  selectProduct(product: Product) {

    sessionStorage.setItem(
      'lastProductId',
      product.id
    );

    sessionStorage.setItem(
      'category',
      this.selectedCategory
    );

    this.router.navigate([
      '/products',
      product.id
    ]);

  }

}