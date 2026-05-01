import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  create(): void {
    this.toast.show('Cuenta creada exitosamente');
    this.router.navigateByUrl('/');
  }
}
