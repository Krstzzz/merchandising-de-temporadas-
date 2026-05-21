import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-confirm',
  imports: [RouterLink],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  readonly orders = inject(OrdersService);
}
