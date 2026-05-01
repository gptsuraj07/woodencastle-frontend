import { Injectable } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private API = 'http://127.0.0.1:8000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API);
  }

  getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.API}/${id}`);
}

addReview(review: any) {
  return this.http.post('http://localhost:8000/reviews', review);
}

getReviews(productId: string) {
  return this.http.get<any[]>(`http://localhost:8000/reviews/${productId}`);
}
}