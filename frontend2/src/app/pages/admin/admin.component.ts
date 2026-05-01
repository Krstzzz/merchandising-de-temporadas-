import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users';

@Component({
  selector: 'app-admin',
  imports: [RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  readonly products = inject(ProductsService).products;
  private readonly toast = inject(ToastService);
  readonly tab = signal<AdminTab>('dashboard');

  notify(message: string): void {
    this.toast.show(message);
  }
}
