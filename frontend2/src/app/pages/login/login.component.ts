import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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

  loginForm = {
    email: '',
    password: ''
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
}
