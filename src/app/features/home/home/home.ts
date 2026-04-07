import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../products/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCard } from '../../../shared/product-card/product-card';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ProductCard, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  categoryKeys: string[] = [];
    @Input() product!: Product;
  groupedProducts: { [key: string]: Product[] } = {};
  @Output() productClick = new EventEmitter<Product>();
  newArrivals: Product[] = [];
  featuredProducts: Product[] = []; // renamed (no fake "best sellers")

  loading = true;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {

        if (!products || products.length === 0) {
          this.loading = false;
          return;
        }

        // GROUP BY CATEGORY
        this.groupedProducts = this.groupByCategory(products);
        this.categoryKeys = Object.keys(this.groupedProducts);

        // NEW ARRIVALS (latest inserted - safe fallback)
        this.newArrivals = [...products]
          .slice(-4)      // last 4 items
          .reverse();     // newest first

        // FEATURED PRODUCTS (stable fallback)
        this.featuredProducts = [...products]
          .slice(0, 4);   // first 4 items

        this.loading = false;
      },

      error: (err) => {
        console.error("HOME ERROR:", err);
        this.loading = false;
      }
    });
  }

  groupByCategory(products: Product[]) {
    return products.reduce((acc: { [key: string]: Product[] }, product: Product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  }

  trackById(index: number, item: Product) {
    return item.id;
  }

  handleClick(event: Event) {
  event.preventDefault(); // stop default anchor behavior
  this.productClick.emit(this.product);
}

goToProduct(product: Product) {
  this.router.navigate(['/product', product.id]);
}
}