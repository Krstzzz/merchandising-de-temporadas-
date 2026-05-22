import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService, Cliente } from "../../services/auth.service";
import { OrdersService } from "../../services/orders.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-profile",
  imports: [FormsModule, RouterLink],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  readonly auth = inject(AuthService);
  readonly orders = inject(OrdersService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  profileForm: Cliente | null = null;
  showPasswordPanel = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  passwordForm = {
    passwordActual: "",
    passwordNuevo: "",
    confirmarPassword: "",
  };

  constructor() {
    const client = this.auth.currentClient();

    if (!client) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.profileForm = { ...client };
    this.orders.loadOrdersByClient(client.id);
  }

  saveProfile(): void {
    if (!this.profileForm) return;

    this.auth.updateProfile(this.profileForm.id, this.profileForm).subscribe({
      next: () => this.toast.show("Perfil actualizado"),
      error: () => this.toast.show("No se pudo actualizar el perfil"),
    });
  }

  togglePasswordPanel(): void {
    this.showPasswordPanel = !this.showPasswordPanel;

    if (!this.showPasswordPanel) {
      this.clearPasswordForm();
    }
  }

  changePassword(): void {
    if (!this.profileForm) return;

    if (!this.passwordForm.passwordActual || !this.passwordForm.passwordNuevo) {
      this.toast.show("Completa la contraseña actual y la nueva");
      return;
    }

    if (this.passwordForm.passwordNuevo.length < 8) {
      this.toast.show("La nueva contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (
      this.passwordForm.passwordNuevo !== this.passwordForm.confirmarPassword
    ) {
      this.toast.show("Las contraseñas nuevas no coinciden");
      return;
    }

    this.auth
      .changePassword(this.profileForm.id, {
        passwordActual: this.passwordForm.passwordActual,
        passwordNuevo: this.passwordForm.passwordNuevo,
      })
      .subscribe({
        next: () => {
          this.clearPasswordForm();
          this.showPasswordPanel = false;
          this.toast.show("Contraseña actualizada");
        },
        error: () => this.toast.show("No se pudo cambiar la contraseña"),
      });
  }

  logout(): void {
    this.auth.logout();
    this.toast.show("Sesión cerrada");
    this.router.navigateByUrl("/");
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: "Pendiente",
      PROCESANDO: "Procesando",
      EN_CAMINO: "En camino",
      ENTREGADO: "Entregado",
      CANCELADO: "Cancelado",
    };

    return labels[status] ?? status;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return "Sin fecha";
    }

    return new Date(value).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  private clearPasswordForm(): void {
    this.passwordForm = {
      passwordActual: "",
      passwordNuevo: "",
      confirmarPassword: "",
    };
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
}
