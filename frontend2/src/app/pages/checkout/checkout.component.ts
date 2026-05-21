import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { OrdersService } from "../../services/orders.service";
import { ToastService } from "../../services/toast.service";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-checkout",
  imports: [FormsModule],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.css",
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  readonly orders = inject(OrdersService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly clienteId = this.auth.getClientId();
  readonly payment = signal<"TARJETA" | "CONTACTO">("TARJETA");

  shippingForm = {
    direccionEnvio: "Av. Ejemplo 123, Lima",
  };

  constructor() {
    if (this.clienteId) {
      this.cart.loadBackendCart(this.clienteId);
    }
  }

  confirm(): void {
    if (!this.shippingForm.direccionEnvio) {
      this.toast.show("Ingresa una dirección de envío");
      return;
    }

    if (
      !this.cart.backendCart() ||
      this.cart.backendCart()?.detalles.length === 0
    ) {
      this.toast.show("Tu carrito está vacío");
      return;
    }

    if (!this.clienteId) {
      this.toast.show("Inicia sesión para finalizar compra");
      return;
    }

    this.orders
      .createFromCart(this.clienteId, {
        direccionEnvio: this.shippingForm.direccionEnvio,
        metodoPago: this.payment(),
      })
      .subscribe({
        next: () => {
          this.cart.backendCart.set(null);
          this.cart.clear();
          this.toast.show("Pedido confirmado");
          this.router.navigateByUrl("/confirm");
        },
        error: (error) => {
          console.error("Error creando pedido", error);
          this.toast.show("No se pudo confirmar el pedido");
        },
      });
  }
}
