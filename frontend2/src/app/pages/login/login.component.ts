import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  login(): void {
    this.toast.show('Sesión iniciada correctamente');
    this.router.navigateByUrl('/');
  }
}
