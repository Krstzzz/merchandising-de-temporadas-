import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  CreateProductRequest,
  CreateProductoVarianteRequest,
} from "../../models/product.model";
import { ProductImagesService } from "../../services/product-images.service";
import { ProductVariantsService } from "../../services/product-variants.service";
import { CategoriesService } from "../../services/categories.service";
import { ProductsService } from "../../services/products.service";
import { ToastService } from "../../services/toast.service";

type AdminTab = "dashboard" | "products" | "orders" | "users";

@Component({
  selector: "app-admin",
  imports: [RouterLink, FormsModule],
  templateUrl: "./admin.component.html",
  styleUrl: "./admin.component.css",
})
export class AdminComponent {
  readonly variantsService = inject(ProductVariantsService);
  readonly imagesService = inject(ProductImagesService);
  readonly productsService = inject(ProductsService);
  readonly categoriesService = inject(CategoriesService);
  private readonly toast = inject(ToastService);
  readonly tab = signal<AdminTab>("dashboard");
  readonly showProductForm = signal(false);
  selectedImage: File | null = null;
  newCategoryName = "";
  newCategoryDescription = "";

  selectedColor = "#111111";
  newSubcategoryName = "";
  extraImages: File[] = [];

  variants: Array<{
    colorHex: string;
    talla: string;
    stock: number;
    precio: number | null;
    sku: string | null;
  }> = [];

  productForm = {
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    subcategoria: "",
    categoriaId: 0,
    tallas: "S,M,L,XL",
    colores: "Negro,Blanco",
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
    if (
      this.categoriesService.categories().length > 0 &&
      !this.productForm.categoriaId
    ) {
      this.productForm.categoriaId = this.categoriesService.categories()[0].id;
    }
  }

  closeProductForm(): void {
    this.showProductForm.set(false);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
  }

  saveProduct(): void {
    if (
      !this.productForm.nombre ||
      !this.productForm.descripcion ||
      !this.productForm.categoriaId
    ) {
      this.toast.show("Completa nombre, descripción y categoría");
      return;
    }

    const request: CreateProductRequest = {
      nombre: this.productForm.nombre,
      descripcion: this.productForm.descripcion,
      precio: Number(this.productForm.precio),
      stock: this.variants.reduce(
        (total, variant) => total + Number(variant.stock),
        0,
      ),
      subcategoria: this.productForm.subcategoria,
      imagenUrl: null,
      categoriaId: Number(this.productForm.categoriaId),
      tallas: this.splitValues(this.productForm.tallas),
      colores: this.splitValues(this.productForm.colores),
    };
    const create$ = this.selectedImage
      ? this.productsService.createProductWithImage(request, this.selectedImage)
      : this.productsService.createProduct(request);

    create$.subscribe({
      next: (product) => {
        for (const variant of this.variants) {
          const variantRequest: CreateProductoVarianteRequest = {
            productoId: product.id,
            colorHex: variant.colorHex,
            talla: variant.talla,
            stock: variant.stock,
            precio: variant.precio,
            sku: variant.sku,
          };

          this.variantsService.createVariant(variantRequest);
        }

        this.extraImages.forEach((image, index) => {
          this.imagesService.uploadImage(
            product.id,
            image,
            null,
            false,
            index + 2,
          );
        });

        this.toast.show("Producto creado correctamente");
        this.resetProductForm();
        this.selectedImage = null;
        this.extraImages = [];
        this.variants = [];
        this.showProductForm.set(false);
      },
      error: () => {
        this.toast.show("No se pudo crear el producto");
      },
    });
  }

  private resetProductForm(): void {
    this.productForm = {
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      subcategoria: "",
      categoriaId: this.categoriesService.categories()[0]?.id ?? 0,
      tallas: "S,M,L,XL",
      colores: "Negro,Blanco",
    };
  }

  private splitValues(value: string): string[] {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  onCategoryChange(): void {
    this.categoriesService.loadSubcategoriesByCategory(
      Number(this.productForm.categoriaId),
    );
    this.productForm.subcategoria = "";
  }

  createCategory(): void {
    if (!this.newCategoryName) {
      this.toast.show("Escribe el nombre de la categoría");
      return;
    }

    this.categoriesService.createCategory({
      nombre: this.newCategoryName,
      descripcion: this.newCategoryDescription || "Sin descripción",
    });

    this.toast.show("Categoría creada");
    this.newCategoryName = "";
    this.newCategoryDescription = "";
  }

  createSubcategory(): void {
    if (!this.newSubcategoryName || !this.productForm.categoriaId) {
      this.toast.show("Selecciona categoría y escribe subcategoría");
      return;
    }

    this.categoriesService.createSubcategory({
      nombre: this.newSubcategoryName,
      categoriaId: Number(this.productForm.categoriaId),
    });

    this.productForm.subcategoria = this.newSubcategoryName;
    this.newSubcategoryName = "";
    this.toast.show("Subcategoría creada");
  }

  addVariant(): void {
    if (
      !this.selectedColor ||
      !this.productForm.tallas ||
      this.productForm.stock <= 0
    ) {
      this.toast.show("Selecciona color, talla y stock");
      return;
    }

    this.variants.push({
      colorHex: this.selectedColor,
      talla: this.productForm.tallas,
      stock: Number(this.productForm.stock),
      precio: Number(this.productForm.precio) || null,
      sku: null,
    });

    this.toast.show("Variante agregada");
  }

  removeVariant(index: number): void {
    this.variants.splice(index, 1);
  }

  onExtraImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.extraImages = Array.from(input.files ?? []);
  }
}
