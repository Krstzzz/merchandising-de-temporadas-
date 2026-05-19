import { Component, computed, effect, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { BackendProductoImagen, BackendProductoVariante } from "../../models/product.model";
import { CartService } from "../../services/cart.service";
import { ProductImagesService } from "../../services/product-images.service";
import { ProductVariantsService } from "../../services/product-variants.service";
import { ProductsService } from "../../services/products.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-product-detail",
  imports: [RouterLink],
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent {
  private readonly productsService = inject(ProductsService);
  private readonly variantsService = inject(ProductVariantsService);
  private readonly imagesService = inject(ProductImagesService);
  private readonly route = inject(ActivatedRoute);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  readonly qty = signal(1);
  readonly product = computed(() =>
    this.productsService.byId(Number(this.route.snapshot.paramMap.get("id"))),
  );

  readonly variants = signal<BackendProductoVariante[]>([]);
  readonly images = signal<BackendProductoImagen[]>([]);
  readonly color = signal("");
  readonly size = signal("");

  readonly availableColors = computed(() => {
    return [...new Set(this.variants().map((variant) => variant.colorHex))];
  });

  readonly availableSizes = computed(() => {
    return [
      ...new Set(
        this.variants()
          .filter((variant) => variant.colorHex === this.color())
          .map((variant) => variant.talla),
      ),
    ];
  });

  readonly selectedVariant = computed(() => {
    return this.variants().find(
      (variant) => variant.colorHex === this.color() && variant.talla === this.size(),
    );
  });

  readonly selectedStock = computed(() => this.selectedVariant()?.stock ?? 0);

  readonly selectedImageUrl = computed(() => {
    const colorImage = this.images().find((image) => image.colorHex === this.color());
    const principalImage = this.images().find((image) => image.principal);
    return colorImage?.imagenUrl ?? principalImage?.imagenUrl ?? this.product()?.imageUrl ?? null;
  });

  constructor() {
    const productId = Number(this.route.snapshot.paramMap.get("id"));

    this.productsService.loadProducts();
    this.loadVariants(productId);
    this.loadImages(productId);

    effect(() => {
      const firstColor = this.availableColors()[0];
      if (!this.color() && firstColor) {
        this.color.set(firstColor);
      }
    });

    effect(() => {
      const sizes = this.availableSizes();
      if (!sizes.includes(this.size())) {
        this.size.set(sizes[0] ?? "");
      }
    });
  }

  changeQty(delta: number): void {
    this.qty.update((value) => {
      const next = Math.max(1, value + delta);
      const stock = this.selectedStock();
      return stock > 0 ? Math.min(next, stock) : next;
    });
  }

  add(): void {
    const product = this.product();
    const variant = this.selectedVariant();

    if (!product || !variant) {
      this.toast.show("Selecciona una talla y color disponibles");
      return;
    }

    if (this.qty() > variant.stock) {
      this.toast.show("No hay stock suficiente para esa variante");
      return;
    }

    this.cart.add(product, variant.talla, variant.colorHex, this.qty());
    this.toast.show(`${product.name} agregado al carrito`);
  }

  private loadVariants(productId: number): void {
    this.variantsService.getByProduct(productId).subscribe({
      next: (variants) => this.variants.set(variants),
      error: (error) => console.error("Error cargando variantes", error),
    });
  }

  private loadImages(productId: number): void {
    this.imagesService.getByProduct(productId).subscribe({
      next: (images) => this.images.set(images),
      error: (error) => console.error("Error cargando imágenes", error),
    });
  }
}
