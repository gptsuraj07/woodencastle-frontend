import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductService } from '../../products/product.service';
import { Product } from '../../../core/models/product.model';

import { ProductCard } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductCard
  ],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class Shop implements OnInit {

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  searchText = '';
  selectedCategory = 'all';
  sortOption = 'default';

  categories: string[] = [];

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    this.productService.getProducts().subscribe({

      next: (products) => {

        console.log(products);

        this.allProducts = products;
        this.filteredProducts = products;

        this.categories = [

          'all',

          ...new Set(

            products
              .map(p => p.category)
              .filter(category => !!category)

          )

        ];

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  applyFilters(): void {

    let data = [...this.allProducts];

    // CATEGORY FILTER
    if (this.selectedCategory !== 'all') {

      data = data.filter(
        p => p.category === this.selectedCategory
      );

    }

    // SEARCH FILTER
    if (this.searchText.trim()) {

      data = data.filter(p =>

        p.name
          ?.toLowerCase()
          .includes(
            this.searchText.toLowerCase()
          )

      );

    }

    // SORTING
    if (this.sortOption === 'name-asc') {

      data.sort((a, b) =>

        a.name.localeCompare(b.name)

      );

    }

    if (this.sortOption === 'name-desc') {

      data.sort((a, b) =>

        b.name.localeCompare(a.name)

      );

    }

    this.filteredProducts = data;

  }

  selectCategory(category: string): void {

    this.selectedCategory = category;
    this.applyFilters();

  }

  formatLabel(label: string | undefined): string {

    if (!label) {
      return '';
    }

    return label
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

  }

}