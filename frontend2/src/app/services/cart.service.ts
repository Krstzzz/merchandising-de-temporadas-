import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { CartItem, Product } from "../models/product.model";
import { BackendCarrito } from "../models/product.model";

export interface AgregarCarritoRequest {
  clienteId: number;
  varianteId: number;
  cantidad: number;
}

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8080/api/carritos";

  readonly items = signal<CartItem[]>([]);

  readonly count = () => this.items().reduce((sum, item) => sum + item.qty, 0);

  readonly subtotal = () =>
    this.items().reduce((sum, item) => sum + item.price * item.qty, 0);

  readonly shipping = () =>
    this.subtotal() > 100 || this.subtotal() === 0 ? 0 : 10;

  readonly total = () => this.subtotal() + this.shipping();

  /*------------*/

  readonly backendCart = signal<BackendCarrito | null>(null);

  readonly backendCount = () =>
    this.backendCart()?.detalles.reduce(
      (sum, item) => sum + item.cantidad,
      0,
    ) ?? 0;

  readonly backendSubtotal = () =>
    this.backendCart()?.detalles.reduce(
      (sum, item) => sum + Number(item.precioUnitario) * item.cantidad,
      0,
    ) ?? 0;

  readonly backendShipping = () =>
    this.backendSubtotal() > 100 || this.backendSubtotal() === 0 ? 0 : 10;

  readonly backendTotal = () => this.backendSubtotal() + this.backendShipping();

  /*-----------*/
  add(
    product: Product,
    size = "M",
    color = product.colors[0] ?? "#111",
    qty = 1,
  ): void {
    this.items.update((items) => {
      const match = items.find(
        (item) =>
          item.id === product.id && item.size === size && item.color === color,
      );

      if (match) {
        return items.map((item) =>
          item === match ? { ...item, qty: item.qty + qty } : item,
        );
      }

      return [...items, { ...product, size, color, qty }];
    });
  }

  addBackend(request: AgregarCarritoRequest): void {
    this.http.post(`${this.apiUrl}/agregar`, request).subscribe({
      next: () => this.loadBackendCart(request.clienteId),
      error: (error) => console.error("Error agregando al carrito", error),
    });
  }

  loadBackendCart(clienteId: number): void {
    this.http
      .get<BackendCarrito>(`${this.apiUrl}/cliente/${clienteId}`)
      .subscribe({
        next: (cart) => this.backendCart.set(cart),
        error: (error) => {
          console.error("Error cargando carrito backend", error);
          this.backendCart.set(null);
        },
      });
  }

  removeBackendDetail(detalleId: number, clienteId: number): void {
    this.http.delete(`${this.apiUrl}/detalle/${detalleId}`).subscribe({
      next: () => this.loadBackendCart(clienteId),
      error: (error) => console.error("Error eliminando detalle", error),
    });
  }

  updateQty(index: number, delta: number): void {
    this.items.update((items) =>
      items.map((item, i) =>
        i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  }

  remove(index: number): void {
    this.items.update((items) => items.filter((_, i) => i !== index));
  }

  clear(): void {
    this.items.set([]);
  }
}
