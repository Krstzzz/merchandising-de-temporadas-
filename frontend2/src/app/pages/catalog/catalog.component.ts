import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  imports: [ProductCardComponent, FooterComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  readonly activeFilter = signal('Todos');
  readonly products = computed(() => this.productsService.filter(this.activeFilter()));
  readonly filters = ['Todos', 'Polo', 'Hoodie', 'Anime', 'Videojuegos', 'Películas', 'Música'];

  constructor() {
    this.productsService.loadProducts();
    this.route.queryParamMap.subscribe((params) => {
      this.activeFilter.set(params.get('q') ?? 'Todos');
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  add(product: Product): void {
    this.cart.add(product);
    this.toast.show(`${product.name} agregado al carrito`);
  }
}
