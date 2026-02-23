import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsResponse, Product } from '../utils/product-interface';

@Injectable({
  providedIn: 'root',
})
export class ProductServices {
  private readonly BASE_URL = ' http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(page = 1, limit = 10) {
    return this.http.get<ProductsResponse>(`${this.BASE_URL}?page=${page}&limit=${limit}`);
  }

  getProductById(id: string) {
    return this.http.get<{ success: boolean; data: Product }>(`${this.BASE_URL}/${id}`);
  }
}
