import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product!: Product;
  @Input() priority: boolean = false;
  @Output() productClick = new EventEmitter<Product>();

  onImageError(event: any) {
  event.target.src = 'https://placehold.co/300x300?text=No+Image';
}

handleClick(event: Event) {
  event.preventDefault(); // stop default anchor behavior
  this.productClick.emit(this.product);
}

onClick() {
  this.productClick.emit(this.product);
}

getOptimizedImage(url: string): string {
  return url; // fallback for now
}

getStartingPrice(product: any): number {
  if (!product.variants || product.variants.length === 0) {
    return product.price || 0;
  }

  return Math.min(
    ...product.variants.map((v: any) => v.price || 0)
  );
}
}