
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-deposit-slip',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `<div class="page-container"><h1>Deposit Slip</h1><mat-card><mat-card-content><p>Deposit slip generation and management.</p></mat-card-content></mat-card></div>`,
  styles: [`    .page-container { max-width: 800px; margin: 0 auto; }  `]
})
export class DepositSlipComponent {}
