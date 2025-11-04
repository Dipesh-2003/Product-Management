
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductPage } from '../models/product-page.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService { 

  private readonly apiUrl = 'http://localhost:8080/api/products';
  constructor(private http:HttpClient) { }
  

    getProducts(page: number, size: number): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
  
    getProductsByCategory(categoryId: number, page: number, size: number): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.apiUrl}/by-category/${categoryId}?page=${page}&size=${size}`);
  }

  getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product:Partial<Product>):Observable<Product>{
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id:number,product:Partial<Product>):Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

   deleteProduct(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}/soft`);
  }

  getInactiveProducts(page: number, size: number): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.apiUrl}/inactive?page=${page}&size=${size}`);
  }

  restoreProduct(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/restore`, {});
  }

  permanentDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/permanent`);
  }

  checkProductIdExists(productId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/by-id/${productId}`);
  }

  checkNameExists(name: string, excludeId: number | null): Observable<boolean> {
    let params = new HttpParams().set('name', name);
    if (excludeId !== null) {
      params = params.set('excludeId', excludeId.toString());
    }
    return this.http.get<boolean>(`${this.apiUrl}/exists/by-name`, { params });
  }
  downloadProductsAsCsv(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/download/csv`, {
    responseType: 'blob'
  });
}

downloadProductsAsExcel(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/download/excel`, {
    responseType: 'blob'
  });
}

downloadProductsAsPdf(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/download/pdf`, {
    responseType: 'blob'
  });
}

}