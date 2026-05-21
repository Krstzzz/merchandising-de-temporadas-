import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  readonly cart = inject(CartService);
  readonly clienteId = 1;

  constructor() {
    this.cart.loadBackendCart(this.clienteId);
  }

  remove(detalleId: number): void {
    this.cart.removeBackendDetail(detalleId, this.clienteId);
  }
}
