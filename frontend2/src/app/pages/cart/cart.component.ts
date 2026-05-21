import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-cart",
  imports: [RouterLink],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent {
  private readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly clienteId = this.auth.getClientId();

  constructor() {
    if (this.clienteId) {
      this.cart.loadBackendCart(this.clienteId);
    }
  }

  remove(detalleId: number): void {
    if (!this.clienteId) return;
    this.cart.removeBackendDetail(detalleId, this.clienteId);
  }
}
