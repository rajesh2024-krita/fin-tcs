
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-year',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <h1>Start New Financial Year</h1>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Financial Year Configuration</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="yearForm">
            <mat-form-field appearance="outline">
              <mat-label>Financial Year</mat-label>
              <input matInput formControlName="year" placeholder="2024-2025">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Start Date</mat-label>
              <input matInput type="date" formControlName="startDate">
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary">Start New Financial Year</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { max-width: 600px; margin: 0 auto; }
    mat-form-field { width: 100%; margin: 10px 0; }
  `]
})
export class NewYearComponent {
  yearForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.yearForm = this.fb.group({
      year: ['2024-2025'],
      startDate: ['2024-04-01']
    });
  }
}
