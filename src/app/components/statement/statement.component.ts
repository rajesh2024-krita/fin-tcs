
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="page-container">
      <h1>Account Statements</h1>
      <mat-card>
        <mat-card-content>
          <p>Account statement generation and management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
  `]
})
export class StatementComponent {}
