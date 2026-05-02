import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../products/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCard } from '../../../shared/product-card/product-card';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ProductCard, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  newArrivals: Product[] = [];
  featuredProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {

        if (!products || products.length === 0) {
          this.loading = false;
          return;
        }

        this.newArrivals = [...products].slice(-4).reverse();
        this.featuredProducts = [...products].slice(0, 4);

        this.loading = false;
      },

      error: (err) => {
        console.error("HOME ERROR:", err);
        this.loading = false;
      }
    });
  }

  trackById(index: number, item: Product) {
    return item.id;
  }

goToProduct(product: Product) {
  console.log("CLICK RECEIVED IN HOME:", product);
  this.router.navigate(['/products', product.id]);
}
}