import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Cliente } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  readonly orders = inject(OrdersService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  profileForm: Cliente | null = null;

  constructor() {
    const client = this.auth.currentClient();

    if (!client) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.profileForm = { ...client };
    this.orders.loadOrdersByClient(client.id);
  }

  saveProfile(): void {
    if (!this.profileForm) return;

    this.auth.updateProfile(this.profileForm.id, this.profileForm).subscribe({
      next: () => this.toast.show('Perfil actualizado'),
      error: () => this.toast.show('No se pudo actualizar el perfil')
    });
  }

  logout(): void {
    this.auth.logout();
    this.toast.show('Sesión cerrada');
    this.router.navigateByUrl('/');
  }
}