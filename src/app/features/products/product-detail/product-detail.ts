import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product, Variant } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Review {
  product_id?: string;   // optional for form usage
  name: string;
  rating: number;
  comment: string;
  images: string[];
  created_at?: string;   // comes from backend
}

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {

  product!: Product;
  selectedVariant: Variant | null = null;
  selectedImage!: string;
  loading = true;
hoverRating = 0; 
  reviews: Review[] = [];

 newReview: Review = {
  name: '',
  rating: 0,
  comment: '',
  images: []
};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.productService.getProducts().subscribe({
      next: (products) => {
        const found = products.find(p => p.id === id);

        if (!found) {
          this.router.navigate(['/products']);
          return;
        }

        this.product = found;
        this.selectedImage = this.product.images?.[0] || '';

        if (this.product.variants?.length) {
          this.selectedVariant = this.product.variants[0];
        }
            this.loadReviews();

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectVariant(v: Variant) {
    this.selectedVariant = v;
  }

  getPrice(): number {
    return this.selectedVariant?.price || this.product?.price || 0;
  }

  getVariantLabel(v: any): string {
  return v.label || v.type || 'Default';
}

  goBack() {
    this.router.navigate(['/products']);
  }

  openWhatsApp() {
    const phone = '919710759208';
    const price = this.getPrice();

    let message = `Hello,\n\nI'm interested in:\n${this.product.name}\nPrice: ₹${price}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  /* REVIEW LOGIC */

  setRating(star: number) {
    this.newReview.rating = star;
  }

  handleImageUpload(event: any) {
    const files = event.target.files;

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newReview.images.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

submitReview() {
  if (!this.newReview.name || !this.newReview.rating || !this.newReview.comment) {
    alert('Fill all fields');
    return;
  }

  const payload = {
    ...this.newReview,
    product_id: this.product.id   // 🔴 CRITICAL
  };

  this.productService.addReview(payload).subscribe({
    next: () => {
      this.loadReviews(); // reload from backend

      this.newReview = {
        name: '',
        rating: 0,
        comment: '',
        images: []
      };
    },
    error: () => {
      alert('Failed to submit review');
    }
  });
}

loadReviews() {
  this.productService.getReviews(this.product.id).subscribe({
    next: (data) => {
      this.reviews = data;
    }
  });
}


}