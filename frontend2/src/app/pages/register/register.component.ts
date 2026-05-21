import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  registerForm = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  create(): void {
    if (!this.registerForm.nombre || !this.registerForm.apellido || !this.registerForm.email || !this.registerForm.password) {
      this.toast.show('Completa los datos obligatorios');
      return;
    }

    this.auth.register(this.registerForm).subscribe({
      next: () => {
        this.toast.show('Cuenta creada exitosamente');
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.toast.show('No se pudo crear la cuenta');
      }
    });
  }
}
