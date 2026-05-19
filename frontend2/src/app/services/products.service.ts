import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { BackendProduct, CreateProductRequest, Product, mapBackendProduct } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/productos';

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);

  loadProducts(): void {
    this.loading.set(true);

    this.http.get<BackendProduct[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products.set(data.map(mapBackendProduct));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando productos', error);
        this.loading.set(false);
      }
    });
  }

  createProduct(request: CreateProductRequest): void {
    this.http.post<BackendProduct>(this.apiUrl, request).subscribe({
      next: (product) => {
        this.products.update((items) => [...items, mapBackendProduct(product)]);
      },
      error: (error) => console.error('Error creando producto', error)
    });
  }

  byId(id: number): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  filter(term: string): Product[] {
    const products = this.products();

    if (!term || term === 'Todos') return products;

    const normalized = term.toLowerCase();

    return products.filter((product) =>
      product.cat.toLowerCase().includes(normalized) ||
      product.sub.toLowerCase().includes(normalized) ||
      product.type.toLowerCase().includes(normalized) ||
      product.name.toLowerCase().includes(normalized)
    );
  }
}