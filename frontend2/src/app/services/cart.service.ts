import { Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);

  readonly count = () => this.items().reduce((sum, item) => sum + item.qty, 0);
  readonly subtotal = () => this.items().reduce((sum, item) => sum + item.price * item.qty, 0);
  readonly shipping = () => this.subtotal() > 100 || this.subtotal() === 0 ? 0 : 10;
  readonly total = () => this.subtotal() + this.shipping();

  add(product: Product, size = 'M', color = product.colors[0] ?? '#111', qty = 1): void {
    this.items.update((items) => {
      const match = items.find((item) => item.id === product.id && item.size === size && item.color === color);
      if (match) {
        return items.map((item) => item === match ? { ...item, qty: item.qty + qty } : item);
      }
      return [...items, { ...product, size, color, qty }];
    });
  }

  updateQty(index: number, delta: number): void {
    this.items.update((items) => items.map((item, i) => i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  }

  remove(index: number): void {
    this.items.update((items) => items.filter((_, i) => i !== index));
  }

  clear(): void {
    this.items.set([]);
  }
}
