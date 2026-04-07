import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../shared/product-card/product-card';
import { ActivatedRoute, Router } from '@angular/router';
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
  groupedProducts: { [key: string]: Product[] } = {};
  categories: string[] = [];

  selectedCategory: string = '';

  expandedCategory: string | null = null;
  expandedFullCategory: string | null = null;

  searchText: string = '';
  sortOption: string = 'default';

  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route : ActivatedRoute
  ) {}


ngOnInit() {
  this.productService.getProducts().subscribe({
    next: (products) => {
      this.products = products;

      this.groupedProducts = this.groupByCategory(products);
      this.categories = Object.keys(this.groupedProducts);

      // ✅ 1. Restore category FIRST
      const savedCategory = sessionStorage.getItem('category');

      if (savedCategory && this.categories.includes(savedCategory)) {
        this.selectedCategory = savedCategory;
      } else {
        this.selectedCategory = this.categories[0];
      }

      // ✅ 2. Sync sidebar
      this.expandedCategory = this.selectedCategory;
      this.expandedFullCategory = this.selectedCategory;

      // ✅ 3. Apply filters
      this.applyFilters();

      // ✅ 4. Restore scroll AFTER DOM + images
// ✅ 4. Scroll to last clicked product (NOT pixel)
const lastId = sessionStorage.getItem('lastProductId');

if (lastId) {
  setTimeout(() => {
    const el = document.getElementById('product-' + lastId);

    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;

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


  groupByCategory(products: Product[]) {
    return products.reduce((acc: any, product: Product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }





  toggleCategory(cat: string) {
    this.expandedCategory =
      this.expandedCategory === cat ? null : cat;

    if (this.expandedCategory !== cat) {
      this.expandedFullCategory = null;
    }
  }

  toggleViewAll(cat: string) {
    this.expandedFullCategory =
      this.expandedFullCategory === cat ? null : cat;
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  applyFilters() {
    if (!this.selectedCategory) return;

    let products = this.groupedProducts[this.selectedCategory] || [];

    if (this.searchText) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.sortOption === 'name-asc') {
      products = [...products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (this.sortOption === 'name-desc') {
      products = [...products].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    this.filteredProducts = products;
  }

selectProduct(product: Product) {
  sessionStorage.setItem('lastProductId', product.id);
  sessionStorage.setItem('category', this.selectedCategory);

  this.router.navigate(['/products', product.id]);
}
}