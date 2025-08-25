
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface DepositScheme {
  id: string;
  name: string;
  interestRate: number;
  tenure: number;
  tenureType: string;
  minAmount: number;
  maxAmount: number;
  status: string;
}

@Component({
  selector: 'app-deposit-scheme',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  template: `
    <div class="page-container p-6 space-y-6">
      <!-- Header -->
      <div class="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative z-10">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <mat-icon class="text-2xl">account_balance</mat-icon>
            </div>
            <div>
              <h1 class="text-2xl font-bold">Deposit Scheme Management</h1>
              <p class="text-emerald-100 text-sm">Configure deposit schemes and interest rates</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="flex items-center">
            <mat-icon class="mr-2">add_circle</mat-icon>
            {{isEditing ? 'Edit' : 'Add New'}} Deposit Scheme
          </div>
        </div>
        <div class="form-section-content">
          <form [formGroup]="schemeForm" (ngSubmit)="onSubmit()">
            <div class="form-field-group two-column">
              <div class="form-field-container">
                <label class="form-label required">Scheme Name</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="name" placeholder="Enter scheme name">
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('name')?.errors?.['required'] && schemeForm.get('name')?.touched">
                  Scheme name is required
                </div>
              </div>
              
              <div class="form-field-container">
                <label class="form-label required">Interest Rate (%)</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="interestRate" type="number" step="0.01" placeholder="0.00">
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('interestRate')?.errors?.['required'] && schemeForm.get('interestRate')?.touched">
                  Interest rate is required
                </div>
              </div>
            </div>
            
            <div class="form-field-group two-column">
              <div class="form-field-container">
                <label class="form-label required">Tenure</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="tenure" type="number" placeholder="0">
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('tenure')?.errors?.['required'] && schemeForm.get('tenure')?.touched">
                  Tenure is required
                </div>
              </div>
              
              <div class="form-field-container">
                <label class="form-label required">Tenure Type</label>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="tenureType">
                    <mat-option value="months">Months</mat-option>
                    <mat-option value="years">Years</mat-option>
                  </mat-select>
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('tenureType')?.errors?.['required'] && schemeForm.get('tenureType')?.touched">
                  Tenure type is required
                </div>
              </div>
            </div>
            
            <div class="form-field-group two-column">
              <div class="form-field-container">
                <label class="form-label required">Minimum Amount (₹)</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="minAmount" type="number" placeholder="0">
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('minAmount')?.errors?.['required'] && schemeForm.get('minAmount')?.touched">
                  Minimum amount is required
                </div>
              </div>
              
              <div class="form-field-container">
                <label class="form-label required">Maximum Amount (₹)</label>
                <mat-form-field appearance="outline">
                  <input matInput formControlName="maxAmount" type="number" placeholder="0">
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('maxAmount')?.errors?.['required'] && schemeForm.get('maxAmount')?.touched">
                  Maximum amount is required
                </div>
              </div>
            </div>
            
            <div class="form-field-group">
              <div class="form-field-container">
                <label class="form-label required">Status</label>
                <mat-form-field appearance="outline">
                  <mat-select formControlName="status">
                    <mat-option value="Active">Active</mat-option>
                    <mat-option value="Inactive">Inactive</mat-option>
                  </mat-select>
                </mat-form-field>
                <div class="form-error" *ngIf="schemeForm.get('status')?.errors?.['required'] && schemeForm.get('status')?.touched">
                  Status is required
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button mat-button type="button" (click)="resetForm()" *ngIf="isEditing">
                Cancel
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="schemeForm.invalid">
                <mat-icon class="mr-1">{{isEditing ? 'update' : 'add'}}</mat-icon>
                {{isEditing ? 'Update' : 'Add'}} Scheme
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4">
          <div class="flex items-center space-x-3">
            <mat-icon class="text-white text-xl">table_chart</mat-icon>
            <h3 class="text-lg font-semibold text-white">Deposit Schemes</h3>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="schemes" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 text-left text-sm">Scheme Name</th>
              <td mat-cell *matCellDef="let scheme" class="py-3 px-4 text-sm">{{scheme.name}}</td>
            </ng-container>
            
            <ng-container matColumnDef="interestRate">
              <th mat-header-cell *matHeaderCellDef class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-4 text-left text-sm">Interest Rate</th>
              <td mat-cell *matCellDef="let scheme" class="py-3 px-4 text-sm">{{scheme.interestRate}}%</td>
            </ng-container>
            
            <ng-container matColumnDef="tenure">
              <th mat-header-cell *matHeaderCellDef class="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-3 px-4 text-left text-sm">Tenure</th>
              <td mat-cell *matCellDef="let scheme" class="py-3 px-4 text-sm">{{scheme.tenure}} {{scheme.tenureType}}</td>
            </ng-container>
            
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-4 text-left text-sm">Amount Range</th>
              <td mat-cell *matCellDef="let scheme" class="py-3 px-4 text-sm">₹{{scheme.minAmount | number}} - ₹{{scheme.maxAmount | number}}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 text-left text-sm">Status</th>
              <td mat-cell *matCellDef="let scheme" class="py-3 px-4 text-sm">
                <mat-chip class="status-chip text-xs" [class]="getStatusClass(scheme.status)">
                  {{scheme.status}}
                </mat-chip>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 text-center text-sm">Actions</th>
              <td mat-cell *matCellDef="let scheme" class="py-3 px-4">
                <div class="flex space-x-2 justify-center">
                  <button mat-mini-fab color="primary" (click)="editScheme(scheme)" class="!w-8 !h-8">
                    <mat-icon class="text-sm">edit</mat-icon>
                  </button>
                  <button mat-mini-fab color="warn" (click)="deleteScheme(scheme.id)" class="!w-8 !h-8">
                    <mat-icon class="text-sm">delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }
    
    .status-chip {
      font-weight: 500;
      border-radius: 16px;
      padding: 4px 12px;
      display: inline-flex;
      align-items: center;
    }
    
    .mat-mdc-table {
      background: transparent !important;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DepositSchemeComponent implements OnInit {
  schemeForm!: FormGroup;
  isEditing = false;
  displayedColumns: string[] = ['name', 'interestRate', 'tenure', 'amount', 'status', 'actions'];
  
  schemes: DepositScheme[] = [
    {
      id: 'DS001',
      name: 'Regular Savings',
      interestRate: 7.5,
      tenure: 12,
      tenureType: 'months',
      minAmount: 1000,
      maxAmount: 100000,
      status: 'Active'
    },
    {
      id: 'DS002',
      name: 'Fixed Deposit',
      interestRate: 8.5,
      tenure: 2,
      tenureType: 'years',
      minAmount: 5000,
      maxAmount: 500000,
      status: 'Active'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.schemeForm = this.fb.group({
      name: ['', Validators.required],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      tenure: ['', [Validators.required, Validators.min(1)]],
      tenureType: ['', Validators.required],
      minAmount: ['', [Validators.required, Validators.min(1)]],
      maxAmount: ['', [Validators.required, Validators.min(1)]],
      status: ['Active', Validators.required]
    });
  }

  onSubmit() {
    if (this.schemeForm.valid) {
      console.log('Form submitted:', this.schemeForm.value);
      this.resetForm();
    }
  }

  resetForm() {
    this.schemeForm.reset();
    this.schemeForm.patchValue({ status: 'Active' });
    this.isEditing = false;
  }

  editScheme(scheme: DepositScheme) {
    this.isEditing = true;
    this.schemeForm.patchValue(scheme);
  }

  deleteScheme(id: string) {
    this.schemes = this.schemes.filter(scheme => scheme.id !== id);
  }

  getStatusClass(status: string): string {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}
