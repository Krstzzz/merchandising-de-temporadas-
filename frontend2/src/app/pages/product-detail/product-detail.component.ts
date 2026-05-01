import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  readonly sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  readonly labels = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Amarillo'];
  readonly size = signal('L');
  readonly qty = signal(1);
  readonly product = computed(() => this.productsService.byId(Number(this.route.snapshot.paramMap.get('id'))));
  readonly color = signal('#111');

  constructor() {
    const product = this.product();
    if (!product) {
      this.router.navigateByUrl('/');
      return;
    }
    this.color.set(product.colors[0] ?? '#111');
  }

  changeQty(delta: number): void {
    this.qty.update((value) => Math.max(1, value + delta));
  }

  add(): void {
    const product = this.product();
    if (!product) return;
    this.cart.add(product, this.size(), this.color(), this.qty());
    this.toast.show(`${product.name} agregado al carrito`);
  }
}
