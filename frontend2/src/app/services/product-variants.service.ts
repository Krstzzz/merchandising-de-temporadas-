import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BackendProductoVariante,
  CreateProductoVarianteRequest
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductVariantsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/producto-variantes';

  createVariant(request: CreateProductoVarianteRequest): void {
    this.http.post<BackendProductoVariante>(this.apiUrl, request).subscribe({
      next: (variant) => console.log('Variante creada', variant),
      error: (error) => console.error('Error creando variante', error)
    });
  }
}
