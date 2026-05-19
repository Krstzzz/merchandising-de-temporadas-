import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreateProductRequest } from '../../models/product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  readonly productsService = inject(ProductsService);
  readonly categoriesService = inject(CategoriesService);
  private readonly toast = inject(ToastService);
  readonly tab = signal<AdminTab>('dashboard');
  readonly showProductForm = signal(false);

  productForm = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    subcategoria: '',
    imagenUrl: '',
    categoriaId: 0,
    tallas: 'S,M,L,XL',
    colores: 'Negro,Blanco'
  };

  constructor() {
    this.productsService.loadProducts();
    this.categoriesService.loadCategories();
  }

  notify(message: string): void {
    this.toast.show(message);
  }

  openProductForm(): void {
    this.showProductForm.set(true);
    if (this.categoriesService.categories().length > 0 && !this.productForm.categoriaId) {
      this.productForm.categoriaId = this.categoriesService.categories()[0].id;
    }
  }

  closeProductForm(): void {
    this.showProductForm.set(false);
  }

  saveProduct(): void {
    if (!this.productForm.nombre || !this.productForm.descripcion || !this.productForm.categoriaId) {
      this.toast.show('Completa nombre, descripción y categoría');
      return;
    }

    const request: CreateProductRequest = {
      nombre: this.productForm.nombre,
      descripcion: this.productForm.descripcion,
      precio: Number(this.productForm.precio),
      stock: Number(this.productForm.stock),
      subcategoria: this.productForm.subcategoria,
      imagenUrl: this.productForm.imagenUrl || null,
      categoriaId: Number(this.productForm.categoriaId),
      tallas: this.splitValues(this.productForm.tallas),
      colores: this.splitValues(this.productForm.colores)
    };

    this.productsService.createProduct(request);
    this.toast.show('Producto creado correctamente');
    this.resetProductForm();
    this.showProductForm.set(false);
  }

  private resetProductForm(): void {
    this.productForm = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      subcategoria: '',
      imagenUrl: '',
      categoriaId: this.categoriesService.categories()[0]?.id ?? 0,
      tallas: 'S,M,L,XL',
      colores: 'Negro,Blanco'
    };
  }

  private splitValues(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}