import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-deposit-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="page-container p-6 space-y-6">
      <!-- Header -->
      <div class="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white shadow-xl">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative z-10">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <mat-icon class="text-2xl">receipt</mat-icon>
            </div>
            <div>
              <h1 class="text-2xl font-bold">Deposit Receipt</h1>
              <p class="text-cyan-100 text-sm">Create new deposit receipt transaction</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Member Information Section -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="flex items-center">
            <mat-icon class="mr-2">person</mat-icon>
            Member Information
          </div>
        </div>
        <div class="form-section-content">
          <form [formGroup]="depositForm">
            <div class="form-field-group two-column">
              <div class="form-field-container">
                <label class="form-label required">Member ID</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="memberId" placeholder="Enter member ID">
                </mat-form-field>
                <div class="form-error" *ngIf="depositForm.get('memberId')?.errors?.['required'] && depositForm.get('memberId')?.touched">
                  Member ID is required
                </div>
              </div>

              <div class="form-field-container">
                <label class="form-label">Member Name</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="memberName" readonly>
                </mat-form-field>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Deposit Details Section -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="flex items-center">
            <mat-icon class="mr-2">account_balance_wallet</mat-icon>
            Deposit Details
          </div>
        </div>
        <div class="form-section-content">
          <form [formGroup]="depositForm" (ngSubmit)="onSubmit()">
            <div class="form-field-group two-column">
              <div class="form-field-container">
                <label class="form-label required">Deposit Type</label>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="depositType">
                    <mat-option value="fixed">Fixed Deposit</mat-option>
                    <mat-option value="recurring">Recurring Deposit</mat-option>
                    <mat-option value="savings">Savings Account</mat-option>
                  </mat-select>
                </mat-form-field>
                <div class="form-error" *ngIf="depositForm.get('depositType')?.errors?.['required'] && depositForm.get('depositType')?.touched">
                  Deposit type is required
                </div>
              </div>

              <div class="form-field-container">
                <label class="form-label required">Amount (₹)</label>
                <mat-form-field appearance="outline">
                  <input matInput type="number" formControlName="amount" (blur)="calculateMaturity()" min="1000" placeholder="0.00">
                </mat-form-field>
                <div class="form-error" *ngIf="depositForm.get('amount')?.errors?.['required'] && depositForm.get('amount')?.touched">
                  Amount is required
                </div>
                <div class="form-error" *ngIf="depositForm.get('amount')?.errors?.['min'] && depositForm.get('amount')?.touched">
                  Minimum amount is ₹1,000
                </div>
              </div>
            </div>

            <div class="form-field-group three-column">
              <div class="form-field-container">
                <label class="form-label">Interest Rate (%)</label>
                <mat-form-field appearance="outline">
                  <input matInput type="number" formControlName="interestRate" readonly>
                </mat-form-field>
              </div>

              <div class="form-field-container">
                <label class="form-label">Maturity Date</label>
                <mat-form-field appearance="outline">
                  <input matInput [matDatepicker]="mpicker" formControlName="maturityDate" readonly>
                  <mat-datepicker-toggle matIconSuffix [for]="mpicker"></mat-datepicker-toggle>
                  <mat-datepicker #mpicker></mat-datepicker>
                </mat-form-field>
              </div>

              <div class="form-field-container">
                <label class="form-label">Maturity Amount (₹)</label>
                <mat-form-field appearance="outline">
                  <input matInput type="number" formControlName="maturityAmount" readonly>
                </mat-form-field>
              </div>
            </div>

            <div class="form-field-group two-column">
              <div class="form-field-container">
                <label class="form-label required">Nominee</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="nominee" placeholder="Enter nominee name">
                </mat-form-field>
                <div class="form-error" *ngIf="depositForm.get('nominee')?.errors?.['required'] && depositForm.get('nominee')?.touched">
                  Nominee is required
                </div>
              </div>

              <div class="form-field-container">
                <label class="form-label required">Status</label>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="status">
                    <mat-option value="Active">Active</mat-option>
                    <mat-option value="Matured">Matured</mat-option>
                    <mat-option value="Closed">Closed</mat-option>
                  </mat-select>
                </mat-form-field>
                <div class="form-error" *ngIf="depositForm.get('status')?.errors?.['required'] && depositForm.get('status')?.touched">
                  Status is required
                </div>
              </div>
            </div>

            <div class="form-field-group">
              <div class="form-field-container">
                <label class="form-label">Remarks</label>
                <mat-form-field appearance="outline">
                  <textarea matInput formControlName="remarks" rows="3" placeholder="Enter any additional remarks"></textarea>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="resetForm()">
                <mat-icon class="mr-1">clear</mat-icon>
                Clear
              </button>
              <button mat-button type="button">
                <mat-icon class="mr-1">print</mat-icon>
                Print Receipt
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="depositForm.invalid">
                <mat-icon class="mr-1">save</mat-icon>
                Save Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1000px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-section {
      @apply bg-white p-6 rounded-lg shadow-md border border-gray-200;
    }

    .form-section-header {
      @apply text-lg font-semibold mb-4 pb-2 border-b border-gray-300 flex items-center text-gray-700;
    }

    .form-section-content {
      @apply space-y-6;
    }

    .form-field-group {
      @apply grid gap-6;
    }

    .form-field-group.two-column {
      @apply grid-cols-1 md:grid-cols-2;
    }

    .form-field-group.three-column {
      @apply grid-cols-1 md:grid-cols-3;
    }

    .form-field-container {
      @apply flex flex-col;
    }

    .form-label {
      @apply block text-sm font-medium text-gray-700 mb-1;
    }

    .form-label.required::after {
      content: ' *';
      color: red;
    }

    mat-form-field {
      @apply w-full;
    }

    .form-error {
      @apply text-red-500 text-xs mt-1;
    }

    .form-actions {
      @apply flex justify-end space-x-4 pt-6 border-t border-gray-200;
    }
  `]
})
export class DepositReceiptComponent implements OnInit {
  depositForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.depositForm = this.fb.group({
      memberId: ['', Validators.required],
      memberName: [''],
      depositType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      interestRate: [{ value: '', disabled: true }],
      maturityDate: [{ value: '', disabled: true }],
      maturityAmount: [{ value: '', disabled: true }],
      nominee: ['', Validators.required],
      status: ['Active', Validators.required],
      remarks: ['']
    });
  }

  calculateMaturity() {
    const amount = this.depositForm.get('amount')?.value;
    const depositType = this.depositForm.get('depositType')?.value;

    if (amount && depositType) {
      // Mock calculation - in real app, this would call a service
      let interestRate = 7.5;
      let maturityMonths = 12;

      switch (depositType) {
        case 'fixed':
          interestRate = 8.5;
          maturityMonths = 24;
          break;
        case 'recurring':
          interestRate = 7.0;
          maturityMonths = 12;
          break;
        case 'savings':
          interestRate = 4.0;
          maturityMonths = 0;
          break;
      }

      const maturityAmount = amount * (1 + (interestRate / 100) * (maturityMonths / 12));
      const maturityDate = new Date();
      maturityDate.setMonth(maturityDate.getMonth() + maturityMonths);

      this.depositForm.patchValue({
        interestRate: interestRate,
        maturityDate: maturityDate,
        maturityAmount: Math.round(maturityAmount)
      });
    }
  }

  onSubmit() {
    if (this.depositForm.valid) {
      console.log('Deposit receipt created:', this.depositForm.value);
      // Here you would typically call a service to save the data
    }
  }

  resetForm() {
    this.depositForm.reset();
    this.depositForm.patchValue({ status: 'Active' });
  }
}