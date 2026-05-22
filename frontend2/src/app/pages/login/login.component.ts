import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

type AuthMode = 'login' | 'forgot';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  mode: AuthMode = 'login';
  tokenRequested = false;

  showLoginPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  loginForm = {
    email: '',
    password: ''
  };

  recoveryForm = {
    email: '',
    token: '',
    passwordNuevo: '',
    confirmarPassword: '',
  };

  login(): void {
    this.auth.login(this.loginForm).subscribe({
      next: () => {
        this.toast.show('Sesión iniciada correctamente');
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.toast.show('Correo o contraseña incorrectos');
      }
    });
  }

  showForgotPassword(): void {
    this.mode = 'forgot';
    this.recoveryForm.email = this.loginForm.email;
  }

  showLogin(): void {
    this.mode = 'login';
  }

  requestToken(): void {
    if (!this.recoveryForm.email) {
      this.toast.show('Ingresa tu correo electrónico');
      return;
    }

    this.auth.requestPasswordReset(this.recoveryForm.email).subscribe({
      next: () => {
        this.tokenRequested = true;
        this.toast.show('Token enviado al correo');
      },
      error: () => {
        this.toast.show('No existe una cuenta con ese correo');
      }
    });
  }

  resetPassword(): void {
    if (!this.recoveryForm.email || !this.recoveryForm.token || !this.recoveryForm.passwordNuevo) {
      this.toast.show('Completa correo, token y nueva contraseña');
      return;
    }

    if (this.recoveryForm.passwordNuevo.length < 8) {
      this.toast.show('La nueva contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (this.recoveryForm.passwordNuevo !== this.recoveryForm.confirmarPassword) {
      this.toast.show('Las contraseñas nuevas no coinciden');
      return;
    }

    this.auth.resetPassword({
      email: this.recoveryForm.email,
      token: this.recoveryForm.token,
      passwordNuevo: this.recoveryForm.passwordNuevo,
    }).subscribe({
      next: () => {
        this.toast.show('Contraseña restablecida. Inicia sesión nuevamente');
        this.loginForm.email = this.recoveryForm.email;
        this.loginForm.password = '';
        this.recoveryForm = {
          email: '',
          token: '',
          passwordNuevo: '',
          confirmarPassword: '',
        };
        this.tokenRequested = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.mode = 'login';
      },
      error: () => {
        this.toast.show('Token inválido, vencido o ya usado');
      }
    });
  }
}