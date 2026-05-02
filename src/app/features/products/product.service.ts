import { Injectable } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Review } from '../../core/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

private API = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API);
  }

  getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.API}/${id}`);
}

addReview(review: any) {
  return this.http.post(`${environment.apiUrl}/reviews`, review);
}

getReviews(productId: string) {
  return this.http.get<Review[]>(`${environment.apiUrl}/reviews/${productId}`);
}
}