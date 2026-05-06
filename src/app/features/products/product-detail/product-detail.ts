import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../product.service';
import { Product, Variant } from '../../../core/models/product.model';

interface Review {
  product_id?: string;
  name: string;
  rating: number;
  comment: string;
  images: string[];
  created_at?: string;
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
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {

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

        /* =========================
           DEFAULT IMAGE
        ========================= */

        this.selectedImage =
          this.product.images?.[0] || '';

        /* =========================
           DEFAULT VARIANT
        ========================= */

        if (this.product.variants?.length) {
          this.selectedVariant =
            this.product.variants[0];
        }

        /* =========================
           SEO
        ========================= */

        this.setSEO();

        /* =========================
           REVIEWS
        ========================= */

        this.loadReviews();

        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /* =========================================
     SEO
  ========================================= */

  setSEO(): void {

    const productName =
      this.product.name || 'Wooden Product';

    const seoTitle =
      `${productName} | The Wooden Castle`;

    const seoDescription =
      this.product.description ||
      `Premium handcrafted wooden products from The Wooden Castle.`;

    const image =
      this.product.images?.[0] ||
      'https://thewoodencastle.com/favicon.ico';

    const url =
      window.location.href;

    /* TITLE */

    this.title.setTitle(seoTitle);

    /* META DESCRIPTION */

    this.meta.updateTag({
      name: 'description',
      content: seoDescription
    });

    /* KEYWORDS */

    this.meta.updateTag({
      name: 'keywords',
      content: `
        wooden products,
        chopping boards,
        teak wood,
        handcrafted wooden decor,
        rustic wooden boards,
        kitchen styling boards,
        ${productName}
      `
    });

    /* OPEN GRAPH */

    this.meta.updateTag({
      property: 'og:title',
      content: seoTitle
    });

    this.meta.updateTag({
      property: 'og:description',
      content: seoDescription
    });

    this.meta.updateTag({
      property: 'og:image',
      content: image
    });

    this.meta.updateTag({
      property: 'og:url',
      content: url
    });

    this.meta.updateTag({
      property: 'og:type',
      content: 'product'
    });

    /* TWITTER */

    this.meta.updateTag({
      name: 'twitter:title',
      content: seoTitle
    });

    this.meta.updateTag({
      name: 'twitter:description',
      content: seoDescription
    });

    this.meta.updateTag({
      name: 'twitter:image',
      content: image
    });

    /* CANONICAL */

    let canonical =
      document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;

    if (!canonical) {

      canonical =
        document.createElement('link');

      canonical.setAttribute(
        'rel',
        'canonical'
      );

      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', url);
  }

  /* =========================================
     VARIANTS
  ========================================= */

  selectVariant(v: Variant): void {
    this.selectedVariant = v;
  }

  getPrice(): number {
    return (
      this.selectedVariant?.price ||
      this.product?.price ||
      0
    );
  }

  getVariantLabel(v: any): string {
    return v.label || v.type || 'Default';
  }

  /* =========================================
     NAVIGATION
  ========================================= */

  goBack(): void {
    this.router.navigate(['/products']);
  }

  /* =========================================
     WHATSAPP
  ========================================= */

  openWhatsApp(): void {

    const phone = '919597718532';

    const price = this.getPrice();

    let message =
`Hello,

I'm interested in:

${this.product.name}

Price: ₹${price}`;

    if (this.selectedVariant) {

      message += `

Variant: ${this.getVariantLabel(this.selectedVariant)}`;
    }

    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  }

  /* =========================================
     REVIEW RATING
  ========================================= */

  setRating(star: number): void {
    this.newReview.rating = star;
  }

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  handleImageUpload(event: any): void {

    const files = event.target.files;

    for (let file of files) {

      const reader = new FileReader();

      reader.onload = () => {
        this.newReview.images.push(
          reader.result as string
        );
      };

      reader.readAsDataURL(file);
    }
  }

  /* =========================================
     SUBMIT REVIEW
  ========================================= */

  submitReview(): void {

    if (
      !this.newReview.name ||
      !this.newReview.rating ||
      !this.newReview.comment
    ) {
      alert('Fill all fields');
      return;
    }

    const payload = {
      ...this.newReview,
      product_id: this.product.id
    };

    this.productService.addReview(payload).subscribe({

      next: () => {

        this.loadReviews();

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

  /* =========================================
     LOAD REVIEWS
  ========================================= */

  loadReviews(): void {

    this.productService
      .getReviews(this.product.id)
      .subscribe({

        next: (data) => {
          this.reviews = data;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }
}