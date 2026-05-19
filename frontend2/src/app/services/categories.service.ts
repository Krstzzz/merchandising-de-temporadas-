import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { BackendCategoria } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/categorias';

  readonly categories = signal<BackendCategoria[]>([]);

  loadCategories(): void {
    this.http.get<BackendCategoria[]>(this.apiUrl).subscribe({
      next: (data) => this.categories.set(data),
      error: (error) => console.error('Error cargando categorías', error)
    });
  }
}
