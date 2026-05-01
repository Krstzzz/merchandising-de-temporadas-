import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCardComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  readonly recent = this.productsService.products.slice(0, 8);

  add(product: Product): void {
    this.cart.add(product);
    this.toast.show(`${product.name} agregado al carrito`);
  }
}
