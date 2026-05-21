import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { OrdersService } from "../../services/orders.service";
import { ToastService } from "../../services/toast.service";
import { FormsModule } from "@angular/forms";

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

  readonly clienteId = 1;
  readonly payment = signal<"TARJETA" | "CONTACTO">("TARJETA");

  shippingForm = {
    direccionEnvio: "Av. Ejemplo 123, Lima",
  };

  constructor() {
    this.cart.loadBackendCart(this.clienteId);
  }

  confirm(): void {
    if (!this.shippingForm.direccionEnvio) {
      this.toast.show("Ingresa una dirección de envío");
      return;
    }

    this.orders.createFromCart(this.clienteId, {
      direccionEnvio: this.shippingForm.direccionEnvio,
      metodoPago: this.payment(),
    });

    this.toast.show("Pedido confirmado");
    this.router.navigateByUrl("/confirm");
  }
}
