import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import {
  BackendProduct,
  CreateProductRequest,
  Product,
  mapBackendProduct,
} from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8080/api/productos";

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
        console.error("Error cargando productos", error);
        this.loading.set(false);
      },
    });
  }

  createProduct(request: CreateProductRequest): Observable<BackendProduct> {
    return this.http.post<BackendProduct>(this.apiUrl, request).pipe(
      tap((product) => {
        this.products.update((items) => [...items, mapBackendProduct(product)]);
      }),
    );
  }

  createProductWithImage(
    request: CreateProductRequest,
    image: File,
  ): Observable<BackendProduct> {
    const formData = new FormData();
    formData.append("producto", JSON.stringify(request));
    formData.append("imagen", image);

    return this.http
      .post<BackendProduct>(`${this.apiUrl}/con-imagen`, formData)
      .pipe(
        tap((product) => {
          this.products.update((items) => [
            ...items,
            mapBackendProduct(product),
          ]);
        }),
      );
  }

  byId(id: number): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  filter(term: string): Product[] {
    const products = this.products();

    if (!term || term === "Todos") return products;

    const normalized = term.toLowerCase();

    return products.filter(
      (product) =>
        product.cat.toLowerCase().includes(normalized) ||
        product.sub.toLowerCase().includes(normalized) ||
        product.type.toLowerCase().includes(normalized) ||
        product.name.toLowerCase().includes(normalized),
    );
  }
}
