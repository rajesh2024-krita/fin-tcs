
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface Voucher {
  id: number;
  voucherNo: string;
  voucherType: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Voucher Management</h1>
      
      <!-- Add/Edit Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Create'}} Voucher</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="voucherForm" (ngSubmit)="onSubmit()" class="voucher-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Voucher No.</mat-label>
                <input matInput formControlName="voucherNo" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Voucher Type</mat-label>
                <mat-select formControlName="voucherType" required>
                  <mat-option value="Payment">Payment Voucher</mat-option>
                  <mat-option value="Receipt">Receipt Voucher</mat-option>
                  <mat-option value="Journal">Journal Voucher</mat-option>
                  <mat-option value="Contra">Contra Voucher</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput formControlName="date" type="date" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="2" required></textarea>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Debit Account</mat-label>
                <mat-select formControlName="debitAccount" required>
                  <mat-option value="Cash">Cash</mat-option>
                  <mat-option value="Bank">Bank</mat-option>
                  <mat-option value="Loan Account">Loan Account</mat-option>
                  <mat-option value="Interest Income">Interest Income</mat-option>
                  <mat-option value="Administrative Expenses">Administrative Expenses</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Credit Account</mat-label>
                <mat-select formControlName="creditAccount" required>
                  <mat-option value="Cash">Cash</mat-option>
                  <mat-option value="Bank">Bank</mat-option>
                  <mat-option value="Member Deposits">Member Deposits</mat-option>
                  <mat-option value="Interest Payable">Interest Payable</mat-option>
                  <mat-option value="Service Charges">Service Charges</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Amount (₹)</mat-label>
                <input matInput formControlName="amount" type="number" step="0.01" required>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="voucherForm.invalid">
                {{isEditing ? 'Update' : 'Create'}} Voucher
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="isEditing">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Vouchers Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Vouchers List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="vouchers" class="mat-elevation-z2">
            <ng-container matColumnDef="voucherNo">
              <th mat-header-cell *matHeaderCellDef>Voucher No.</th>
              <td mat-cell *matCellDef="let voucher">{{voucher.voucherNo}}</td>
            </ng-container>
            
            <ng-container matColumnDef="voucherType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let voucher">{{voucher.voucherType}}</td>
            </ng-container>
            
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let voucher">{{voucher.date | date}}</td>
            </ng-container>
            
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let voucher">{{voucher.description}}</td>
            </ng-container>
            
            <ng-container matColumnDef="accounts">
              <th mat-header-cell *matHeaderCellDef>Dr/Cr Accounts</th>
              <td mat-cell *matCellDef="let voucher">
                <div>Dr: {{voucher.debitAccount}}</div>
                <div>Cr: {{voucher.creditAccount}}</div>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let voucher">₹{{voucher.amount | number}}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let voucher">{{voucher.status}}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let voucher">
                <button mat-icon-button color="primary" (click)="editVoucher(voucher)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="printVoucher(voucher)">
                  <mat-icon>print</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteVoucher(voucher.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-card, .table-card {
      margin-bottom: 20px;
    }
    
    .voucher-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    
    table {
      width: 100%;
    }
  `]
})
export class VoucherComponent implements OnInit {
  voucherForm: FormGroup;
  vouchers: Voucher[] = [];
  isEditing = false;
  editingId: number | null = null;
  displayedColumns: string[] = ['voucherNo', 'voucherType', 'date', 'description', 'accounts', 'amount', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.voucherForm = this.fb.group({
      voucherNo: ['', Validators.required],
      voucherType: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      debitAccount: ['', Validators.required],
      creditAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.vouchers = [
      {
        id: 1,
        voucherNo: 'PV001',
        voucherType: 'Payment',
        date: '2024-01-15',
        description: 'Office rent payment for January',
        debitAccount: 'Administrative Expenses',
        creditAccount: 'Cash',
        amount: 15000,
        status: 'Posted'
      },
      {
        id: 2,
        voucherNo: 'RV001',
        voucherType: 'Receipt',
        date: '2024-01-16',
        description: 'Member deposit received',
        debitAccount: 'Cash',
        creditAccount: 'Member Deposits',
        amount: 25000,
        status: 'Posted'
      }
    ];
  }

  onSubmit() {
    if (this.voucherForm.valid) {
      const formValue = this.voucherForm.value;
      
      if (this.isEditing && this.editingId) {
        const index = this.vouchers.findIndex(v => v.id === this.editingId);
        if (index !== -1) {
          this.vouchers[index] = { ...this.vouchers[index], ...formValue };
          this.snackBar.open('Voucher updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        const newVoucher: Voucher = {
          id: this.vouchers.length + 1,
          ...formValue,
          status: 'Posted'
        };
        this.vouchers.push(newVoucher);
        this.snackBar.open('Voucher created successfully!', 'Close', { duration: 3000 });
      }
      
      this.resetForm();
    }
  }

  editVoucher(voucher: Voucher) {
    this.isEditing = true;
    this.editingId = voucher.id;
    this.voucherForm.patchValue(voucher);
  }

  printVoucher(voucher: Voucher) {
    this.snackBar.open(`Printing voucher: ${voucher.voucherNo}`, 'Close', { duration: 3000 });
  }

  deleteVoucher(id: number) {
    if (confirm('Are you sure you want to delete this voucher?')) {
      this.vouchers = this.vouchers.filter(v => v.id !== id);
      this.snackBar.open('Voucher deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  resetForm() {
    this.voucherForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }
}
