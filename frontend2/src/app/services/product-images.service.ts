import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BackendProductoImagen } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductImagesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/producto-imagenes';

  uploadImage(
    productoId: number,
    image: File,
    colorHex: string | null,
    principal: boolean,
    orden: number
  ): void {
    const formData = new FormData();
    formData.append('productoId', String(productoId));

    if (colorHex) {
      formData.append('colorHex', colorHex);
    }

    formData.append('principal', String(principal));
    formData.append('orden', String(orden));
    formData.append('imagen', image);

    this.http.post<BackendProductoImagen>(`${this.apiUrl}/subir`, formData).subscribe({
      next: (response) => console.log('Imagen subida', response),
      error: (error) => console.error('Error subiendo imagen', error)
    });
  }
}
