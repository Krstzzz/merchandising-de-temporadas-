import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";

export interface CrearPedidoRequest {
  direccionEnvio: string;
  metodoPago: "TARJETA" | "CONTACTO";
}

export interface BackendPedido {
  id: number;
  total: number;
  estado: string;
  direccionEnvio: string;
  fechaPedido: string;
}

@Injectable({ providedIn: "root" })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8080/api/pedidos";

  readonly lastOrder = signal<BackendPedido | null>(null);

  createFromCart(clienteId: number, request: CrearPedidoRequest): void {
    this.http
      .post<BackendPedido>(`${this.apiUrl}/crear-desde-carrito/${clienteId}`, request)
      .subscribe({
        next: (order) => {
          this.lastOrder.set(order);
        },
        error: (error) => {
          console.error("Error creando pedido", error);
        },
      });
  }
}
