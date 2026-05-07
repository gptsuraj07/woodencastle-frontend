import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-upload',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-upload.html',
  styleUrl: './product-upload.css',
})
export class ProductUpload implements OnInit {

  constructor(private http: HttpClient) {}

  name = '';
  // category = '';
  description = '';
  files: File[] = [];
  showDeleteModal = false;
selectedProduct: any = null;
  isAuthenticated = false;
  token: string = '';
  username = '';
  password = '';
  parentCategories: string[] = [];
  parentCategory = '';

subCategory = '';
subCategories: string[] = [];
  existingImages: string[] = [];

  products: any[] = [];

  variants: any[] = [
    { label: 'Standard', price: 0, dimensions: '' }
  ];

  editMode = false;
  editingId: string | null = null;

ngOnInit() {
  const savedToken = localStorage.getItem('token');

  if (savedToken) {
    this.token = savedToken;
    this.isAuthenticated = true;
    this.fetchProducts();
  }
}

  // LOGIN
login() {
  const formData = new FormData();
  formData.append('username', this.username);
  formData.append('password', this.password);

  this.http.post('https://api.thewoodencastle.com/admin/login', formData)
    .subscribe((res: any) => {

      console.log("LOGIN RESPONSE:", res);

localStorage.setItem(
  'token',
  res.access_token
);

// IMPORTANT
this.token = res.access_token;

this.isAuthenticated = true;

// refresh products
this.fetchProducts();

    }, err => {
      console.error("LOGIN ERROR:", err);
    });
}

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.token = '';
  }

  // FETCH PRODUCTS
 fetchProducts() {
  const token = this.token;

  this.http.get(`${environment.apiUrl}/products`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (data: any) => {
      this.products = data;
      // ================= PARENT CATEGORIES =================
this.parentCategories = [

  ...new Set(

    this.products.map((p: any) =>

      p.parentCategory ||

      p.category

    )

  )

];

this.parentCategories.sort();

// ================= SUB CATEGORIES =================
this.updateSubCategories();
    },
    error: (err) => {
      console.error("FETCH PRODUCTS ERROR:", err);

      if (err.status === 401) {
        this.logout();
      }
    }
  });
}

updateSubCategories() {

  this.subCategories = [

    ...new Set(

      this.products

        .filter((p: any) =>

          (
            p.parentCategory ||

            p.category
          ) === this.parentCategory

        )

        .map((p: any) => p.subCategory)

        .filter(Boolean)

    )

  ];

  this.subCategories.sort();

}

formatLabel(value: string): string {

  if (!value) return '';

  return value

    .replace(/-/g, ' ')

    .replace(/\b\w/g, c =>
      c.toUpperCase()
    );

}

  // FILE
onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const newFiles = Array.from(input.files);

  this.files = [...this.files, ...newFiles].slice(0, 4);

  input.value = ''; // 🔥 important
}
  // SUBMIT
submitForm() {

  // ================= VALIDATION =================
  if (!this.name.trim()) {

    alert('Product name required');

    return;

  }

  if (!this.parentCategory.trim()) {

    alert('Main category required');

    return;

  }

  const formData = new FormData();

  // ================= NORMALIZE CATEGORIES =================
  const normalizedParent = this.parentCategory

    .trim()

    .toLowerCase()

    .replace(/\s+/g, '-');

  const normalizedSub = this.subCategory

    ? this.subCategory

        .trim()

        .toLowerCase()

        .replace(/\s+/g, '-')

    : '';

  // ================= BASIC =================
  formData.append(
    'name',
    this.name
  );

  // ================= CATEGORY STRUCTURE =================
  formData.append(
    'parentCategory',
    normalizedParent
  );

  // OPTIONAL SUBCATEGORY
  formData.append(
    'subCategory',
    normalizedSub
  );

  // BACKWARD COMPATIBILITY
  formData.append(
    'category',
    normalizedSub || normalizedParent
  );

  // ================= DESCRIPTION =================
  formData.append(
    'description',
    this.description
  );

  // ================= VARIANTS =================
  formData.append(
    'variants',
    JSON.stringify(this.variants)
  );

  // ================= EXISTING IMAGES =================
  formData.append(
    'existing_images',
    JSON.stringify(this.existingImages)
  );

  // ================= FILES =================
  if (this.files.length > 0) {

    this.files.forEach(file => {

      formData.append(
        'files',
        file
      );

    });

  }

  // ================= API URL =================
  const url = this.editMode

    ? `${environment.apiUrl}/admin/update-product/${this.editingId}`

    : `${environment.apiUrl}/admin/castle-products`;

  // ================= METHOD =================
  const method =
    this.editMode
      ? 'PUT'
      : 'POST';

  // ================= REQUEST =================
  fetch(url, {

    method: method,

    headers: {

      Authorization:
        `Bearer ${localStorage.getItem('token')}`

    },

    body: formData

  })

  .then(async (res) => {

    if (!res.ok) {

      const err = await res.json();

      console.error(err);

      alert(
        err.detail || 'Something went wrong'
      );

      return;
    }

    this.resetForm();

    this.fetchProducts();

  })

  .catch((err) => {

    console.error(err);

    alert('Failed to save product');

  });

}

  // DELETE
  deleteProduct(id: string) {
    fetch(`${environment.apiUrl}/admin/delete-product/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
    .then(() => this.fetchProducts());
  }


  // EDIT
editProduct(product: any) {

  this.name =
    product.name || '';

  // ================= CATEGORY =================
  this.parentCategory =

    product.parentCategory ||

    product.category ||

    '';

  // LOAD SUBCATEGORY OPTIONS
  this.updateSubCategories();

  // ================= SUB CATEGORY =================
  this.subCategory =
    product.subCategory || '';

  // ================= DESCRIPTION =================
  this.description =
    product.description || '';

  // ================= VARIANTS =================
  if (product.variants?.length) {

    this.variants =
      product.variants.map((v: any) => ({

        label:

          v.label ||

          v.type ||

          'Default',

        price:
          v.price || 0,

        dimensions:
          v.dimensions || ''

      }));

  } else {

    this.variants = [
      {
        label: 'Standard',
        price: 0,
        dimensions: ''
      }
    ];

  }

  // ================= EXISTING IMAGES =================
  this.existingImages = [
    ...(product.images || [])
  ];

  // ================= RESET NEW FILES =================
  this.files = [];

  // ================= EDIT MODE =================
  this.editMode = true;

  this.editingId = product.id;

}

  // RESET
resetForm() {

  this.name = '';

  this.parentCategory = '';

  this.subCategory = '';

  this.description = '';

  this.files = [];

  this.existingImages = [];

  this.subCategories = [];

  this.variants = [
    {
      label: 'Standard',
      price: 0,
      dimensions: ''
    }
  ];

  this.editMode = false;

  this.editingId = null;

}


  removeFile(index: number) {
  if (index < 0 || index >= this.files.length) return;

  this.files.splice(index, 1);

  // Force UI refresh (Angular usually handles it, but safe)
  this.files = [...this.files];
}

  // HELPERS
getPreview(file: File): string {

  const name = file.name.toLowerCase();

  // 🚫 HEIC not supported in browser
  if (name.endsWith('.heic') || name.endsWith('.heif')) {
    return 'assets/heic-placeholder.png';
  }

  return URL.createObjectURL(file);
}

removeExistingImage(img: string) {
  this.existingImages = this.existingImages.filter(i => i !== img);
}


  getProductPrice(product: any): number {
    return product?.variants?.[0]?.price || 0;
  }

  addVariant() {
    this.variants.push({ label: '', price: 0, dimensions: '' });
  }

  removeVariant(i: number) {
    this.variants.splice(i, 1);
  }

  openDeleteModal(product: any) {
  this.selectedProduct = product;
  this.showDeleteModal = true;
}

confirmDelete() {
  if (!this.selectedProduct) return;

  this.deleteProduct(this.selectedProduct.id);

  this.showDeleteModal = false;
  this.selectedProduct = null;
}

cancelDelete() {
  this.showDeleteModal = false;
  this.selectedProduct = null;
}
}