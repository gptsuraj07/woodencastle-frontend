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
  const variants = this.parseVariants(product.variants);

  if (variants.length === 0) {
    return product.price || 0;
  }

  return Math.min(
    ...variants.map((v: any) => v.price || 0)
  );
}

parseVariants(variants: any): any[] {
  if (!variants) return [];

  // already array
  if (Array.isArray(variants)) {
    return variants;
  }

  // stringified JSON
  if (typeof variants === 'string') {
    try {
      return JSON.parse(variants);
    } catch (e) {
      console.error('Invalid variants JSON', e);
      return [];
    }
  }

  return [];
}
}