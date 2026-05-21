import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

export interface CrearPedidoRequest {
  direccionEnvio: string;
  metodoPago: "TARJETA" | "CONTACTO";
}

export interface BackendPedido {
  id: number;
  total: number;
  estado: "PENDIENTE" | "PROCESANDO" | "EN_CAMINO" | "ENTREGADO" | "CANCELADO";
  direccionEnvio: string;
  fechaPedido: string;
  cliente?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  detalles?: Array<{
    id: number;
    cantidad: number;
    talla: string;
    color: string;
    precioUnitario: number;
    subtotal: number;
    producto: {
      id: number;
      nombre: string;
    };
  }>;
  pago?: {
    id: number;
    metodoPago: "TARJETA" | "CONTACTO";
    estadoPago: "PENDIENTE" | "PAGADO" | "RECHAZADO";
    monto: number;
  };
}

export type EstadoPedido =
  | "PENDIENTE"
  | "PROCESANDO"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

@Injectable({ providedIn: "root" })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8080/api/pedidos";

  readonly lastOrder = signal<BackendPedido | null>(null);
  readonly orders = signal<BackendPedido[]>([]);

  createFromCart(
    clienteId: number,
    request: CrearPedidoRequest,
  ): Observable<BackendPedido> {
    return this.http
      .post<BackendPedido>(
        `${this.apiUrl}/crear-desde-carrito/${clienteId}`,
        request,
      )
      .pipe(
        tap((order) => {
          this.lastOrder.set(order);
        }),
      );
  }

  loadOrders(): void {
    this.http.get<BackendPedido[]>(this.apiUrl).subscribe({
      next: (orders) => {
        const sortedOrders = [...orders].sort((a, b) => b.id - a.id);
        this.orders.set(sortedOrders);
      },
      error: (error) => console.error("Error cargando pedidos", error),
    });
  }

  loadOrdersByClient(clienteId: number): void {
    this.http
      .get<BackendPedido[]>(`${this.apiUrl}/cliente/${clienteId}`)
      .subscribe({
        next: (orders) => {
          const sortedOrders = [...orders].sort((a, b) => b.id - a.id);
          this.orders.set(sortedOrders);
        },
        error: (error) =>
          console.error("Error cargando pedidos del cliente", error),
      });
  }

  updateStatus(orderId: number, estado: EstadoPedido): void {
    this.http
      .put<BackendPedido>(
        `${this.apiUrl}/${orderId}/estado?estado=${estado}`,
        {},
      )
      .subscribe({
        next: (updated) => {
          this.orders.update((orders) =>
            orders
              .map((order) => (order.id === updated.id ? updated : order))
              .sort((a, b) => b.id - a.id),
          );
        },
        error: (error) => console.error("Error actualizando estado", error),
      });
  }
}
