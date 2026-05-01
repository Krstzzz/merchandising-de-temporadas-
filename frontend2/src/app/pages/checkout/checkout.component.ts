import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  readonly payment = signal<'card' | 'contact'>('card');

  confirm(): void {
    this.toast.show('Pedido confirmado');
  }
}
