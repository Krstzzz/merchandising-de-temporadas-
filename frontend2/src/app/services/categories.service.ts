import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  BackendCategoria,
  BackendSubcategoria,
  CreateSubcategoriaRequest
} from '../models/product.model';
import * as productModel from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly categoriasUrl = 'http://localhost:8080/api/categorias';
  private readonly subcategoriasUrl = 'http://localhost:8080/api/subcategorias';

  readonly categories = signal<BackendCategoria[]>([]);
  readonly subcategories = signal<BackendSubcategoria[]>([]);

  loadCategories(): void {
    this.http.get<BackendCategoria[]>(this.categoriasUrl).subscribe({
      next: (data) => this.categories.set(data),
      error: (error) => console.error('Error cargando categorías', error)
    });
  }

  loadSubcategoriesByCategory(categoriaId: number): void {
    if (!categoriaId) {
      this.subcategories.set([]);
      return;
    }

    this.http.get<BackendSubcategoria[]>(`${this.subcategoriasUrl}/categoria/${categoriaId}`).subscribe({
      next: (data) => this.subcategories.set(data),
      error: (error) => console.error('Error cargando subcategorías', error)
    });
  }

  createSubcategory(request: CreateSubcategoriaRequest): void {
    this.http.post<BackendSubcategoria>(this.subcategoriasUrl, request).subscribe({
      next: (subcategory) => {
        this.subcategories.update((items) => [...items, subcategory]);
      },
      error: (error) => console.error('Error creando subcategoría', error)
    });
  }

  createCategory(request: productModel.CreateCategoriaRequest): void {
  this.http.post<BackendCategoria>(this.categoriasUrl, request).subscribe({
    next: (category) => {
      this.categories.update((items) => [...items, category]);
    },
    error: (error) => console.error('Error creando categoría', error)
  });
}

}

export interface CreateCategoriaRequest {
  nombre: string;
  descripcion: string;
}
