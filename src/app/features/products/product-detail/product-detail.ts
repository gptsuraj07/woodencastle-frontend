import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Product, Variant } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {

  product!: Product;
  selectedVariant: Variant | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location : Location,
    private router : Router
  ) {}

selectedImage!: string;

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  this.productService.getProducts().subscribe({
    next: (products) => {
      this.product = products.find(p => p.id === id)!;

      if (this.product?.images?.length) {
        this.selectedImage = this.product.images[0];
      }

      if (this.product?.variants?.length) {
        this.selectedVariant = this.product.variants[0];
      }

      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  selectVariant(v: Variant) {
    this.selectedVariant = v;
  }

  getPrice() {
    return this.selectedVariant?.price || 0;
  }

goBack() {
  this.router.navigate(['/products']);
}

openWhatsApp() {
  const phone = '919710759208';

  let message = `Hello,\n\n`;
  message += `I'm interested in the following product:\n\n`;

  message += `Product: ${this.product.name}\n`;

  if (this.selectedVariant) {
    message += `Variant: ${this.selectedVariant.type}\n`;

    if (this.selectedVariant.dimensions) {
      message += `Dimensions: ${this.selectedVariant.dimensions}\n`;
    }

    message += `Price: ₹${this.selectedVariant.price}\n`;
  }

  message += `\nPlease share more details about availability and delivery.\n`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
}