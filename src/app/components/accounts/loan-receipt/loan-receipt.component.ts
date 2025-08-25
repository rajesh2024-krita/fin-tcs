
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface AddAmountEntry {
  type: string;
  amount: number;
  id: number;
}

@Component({
  selector: 'app-loan-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="content-header mb-6">
        <div class="breadcrumb">
          <span>Accounts</span>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
          <span class="breadcrumb-active">Loan Receipt</span>
        </div>
        <h1 class="text-page-title">Loan Receipt</h1>
        <p class="text-body text-gray-600 dark:text-gray-400">Process loan receipt transactions</p>
      </div>

      <!-- Main Form -->
      <form class="form-container" [formGroup]="loanReceiptForm">
        <mat-card class="card">
          <!-- Card Header -->
          <div class="card-header bg-gradient-to-r from-green-600 to-blue-600">
            <div class="card-title">
              <mat-icon>receipt</mat-icon>
              <span>Loan Receipt Entry</span>
            </div>
          </div>

          <div class="card-content">
            <!-- Top Section Fields -->
            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>description</mat-icon>
                <span>Receipt Details</span>
              </div>
              <div class="form-section-content">
                <div class="form-grid form-grid-3">
                  <div class="form-field">
                    <label class="form-label form-label-required">No.</label>
                    <input 
                      type="text" 
                      class="form-input"
                      placeholder="Receipt number"
                      formControlName="receiptNo">
                    <div class="form-error" *ngIf="loanReceiptForm.get('receiptNo')?.invalid && loanReceiptForm.get('receiptNo')?.touched">
                      Receipt number is required
                    </div>
                  </div>

                  <div class="form-field">
                    <label class="form-label form-label-required">Bank</label>
                    <select class="form-select" formControlName="bank">
                      <option value="">Select bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                    <div class="form-error" *ngIf="loanReceiptForm.get('bank')?.invalid && loanReceiptForm.get('bank')?.touched">
                      Bank selection is required
                    </div>
                  </div>

                  <div class="form-field">
                    <label class="form-label form-label-required">Date</label>
                    <input 
                      type="date" 
                      class="form-input"
                      formControlName="date">
                    <div class="form-error" *ngIf="loanReceiptForm.get('date')?.invalid && loanReceiptForm.get('date')?.touched">
                      Date is required
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Member Details Section -->
            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>person</mat-icon>
                <span>Member Details</span>
              </div>
              <div class="form-section-content">
                <div class="form-grid form-grid-2">
                  <div class="form-field">
                    <label class="form-label form-label-required">Mem. No.</label>
                    <div class="input-group">
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="Enter member number"
                        formControlName="memberNo">
                      <button type="button" class="btn btn-outline" (click)="browseMember()">
                        <mat-icon>search</mat-icon>
                        Browse
                      </button>
                    </div>
                    <div class="form-error" *ngIf="loanReceiptForm.get('memberNo')?.invalid && loanReceiptForm.get('memberNo')?.touched">
                      Member number is required
                    </div>
                  </div>

                  <div class="form-field">
                    <label class="form-label">Name</label>
                    <input 
                      type="text" 
                      class="form-input"
                      placeholder="Member name (auto-filled)"
                      formControlName="memberName"
                      readonly>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amount Section -->
            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>currency_rupee</mat-icon>
                <span>Amount Details</span>
              </div>
              <div class="form-section-content">
                <div class="form-grid form-grid-1">
                  <div class="form-field">
                    <label class="form-label form-label-required">Amount</label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Enter amount"
                        formControlName="amount"
                        (input)="onAmountChange()">
                      <button type="button" class="btn btn-primary" (click)="calculateAmount()">
                        <mat-icon>calculate</mat-icon>
                        Calculate
                      </button>
                    </div>
                    <div class="form-error" *ngIf="loanReceiptForm.get('amount')?.invalid && loanReceiptForm.get('amount')?.touched">
                      Amount is required
                    </div>
                  </div>

                  <div class="form-field">
                    <label class="form-label">Add. Amount</label>
                    <div class="flex gap-2">
                      <select class="form-select flex-1" [(ngModel)]="selectedAddType" [ngModelOptions]="{standalone: true}">
                        <option value="">Select type</option>
                        <option value="Interest">Interest</option>
                        <option value="Penalty">Penalty</option>
                        <option value="Processing Fee">Processing Fee</option>
                        <option value="Other">Other</option>
                      </select>
                      <input 
                        type="number" 
                        class="form-input flex-1"
                        placeholder="Additional amount"
                        [(ngModel)]="additionalAmount"
                        [ngModelOptions]="{standalone: true}">
                      <button type="button" class="btn btn-success" (click)="addAdditionalAmount()" [disabled]="!selectedAddType || !additionalAmount">
                        <mat-icon>add</mat-icon>
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Additional Amount Table -->
                <div class="mt-4" *ngIf="additionalAmounts.length > 0">
                  <div class="table-container">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of additionalAmounts">
                          <td>{{ item.type }}</td>
                          <td class="text-right">{{ item.amount | currency:'INR':'symbol':'1.2-2' }}</td>
                          <td>
                            <button type="button" class="btn btn-sm btn-danger" (click)="removeAdditionalAmount(item.id)">
                              <mat-icon>delete</mat-icon>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-2 text-right font-semibold">
                    Total Additional: {{ getTotalAdditional() | currency:'INR':'symbol':'1.2-2' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Details Section -->
            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>payment</mat-icon>
                <span>Payment Details</span>
              </div>
              <div class="form-section-content">
                <div class="form-grid form-grid-3">
                  <div class="form-field">
                    <label class="form-label">Ch No.</label>
                    <input 
                      type="text" 
                      class="form-input"
                      placeholder="Cheque number"
                      formControlName="chequeNo">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Date</label>
                    <input 
                      type="date" 
                      class="form-input"
                      formControlName="chequeDate">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Pass Date</label>
                    <input 
                      type="date" 
                      class="form-input"
                      formControlName="passDate">
                  </div>
                </div>

                <div class="form-grid form-grid-2">
                  <div class="form-field">
                    <label class="form-label">Narration</label>
                    <input 
                      type="text" 
                      class="form-input"
                      placeholder="Enter narration"
                      formControlName="narration">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Remarks</label>
                    <input 
                      type="text" 
                      class="form-input"
                      placeholder="Enter remarks"
                      formControlName="remarks">
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="form-section" *ngIf="loanReceiptForm.get('amount')?.value">
              <div class="form-section-content">
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div class="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span class="text-green-600">{{ getTotalAmount() | currency:'INR':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="card-actions">
            <div class="flex justify-end gap-3">
              <button type="button" class="btn btn-primary" (click)="onSave()">
                <mat-icon>save</mat-icon>
                Save
              </button>
              <button type="button" class="btn btn-secondary" (click)="onPrint()">
                <mat-icon>print</mat-icon>
                Print
              </button>
              <button type="button" class="btn btn-danger" (click)="onDelete()">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
              <button type="button" class="btn btn-success" (click)="onNew()">
                <mat-icon>add</mat-icon>
                New
              </button>
              <button type="button" class="btn btn-secondary" (click)="onClose()">
                <mat-icon>close</mat-icon>
                Close
              </button>
            </div>
          </div>
        </mat-card>
      </form>
    </div>
  `,
  styleUrl: './loan-receipt.component.css'
})
export class LoanReceiptComponent implements OnInit {
  loanReceiptForm: FormGroup;
  additionalAmounts: AddAmountEntry[] = [];
  selectedAddType: string = '';
  additionalAmount: number = 0;
  private nextId = 1;

  // Sample member data
  members = [
    { memberNo: 'M001', name: 'John Doe' },
    { memberNo: 'M002', name: 'Jane Smith' },
    { memberNo: 'M003', name: 'Mike Johnson' },
  ];

  constructor(private fb: FormBuilder) {
    this.loanReceiptForm = this.fb.group({
      receiptNo: ['', Validators.required],
      bank: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      memberNo: ['', Validators.required],
      memberName: [''],
      amount: ['', [Validators.required, Validators.min(1)]],
      chequeNo: [''],
      chequeDate: [''],
      narration: [''],
      remarks: [''],
      passDate: ['']
    });
  }

  ngOnInit() {
    // Watch for member number changes
    this.loanReceiptForm.get('memberNo')?.valueChanges.subscribe(value => {
      const member = this.members.find(m => m.memberNo === value);
      if (member) {
        this.loanReceiptForm.patchValue({ memberName: member.name });
      }
    });
  }

  browseMember() {
    // Simulate member search - in real app, this would open a dialog
    const randomMember = this.members[Math.floor(Math.random() * this.members.length)];
    this.loanReceiptForm.patchValue({
      memberNo: randomMember.memberNo,
      memberName: randomMember.name
    });
  }

  onAmountChange() {
    // Auto-calculate based on amount changes if needed
  }

  calculateAmount() {
    const baseAmount = this.loanReceiptForm.get('amount')?.value || 0;
    const additionalTotal = this.getTotalAdditional();
    
    // Perform any calculations needed
    console.log('Calculating total:', baseAmount + additionalTotal);
  }

  addAdditionalAmount() {
    if (this.selectedAddType && this.additionalAmount > 0) {
      this.additionalAmounts.push({
        id: this.nextId++,
        type: this.selectedAddType,
        amount: this.additionalAmount
      });
      
      // Reset input fields
      this.selectedAddType = '';
      this.additionalAmount = 0;
    }
  }

  removeAdditionalAmount(id: number) {
    this.additionalAmounts = this.additionalAmounts.filter(item => item.id !== id);
  }

  getTotalAdditional(): number {
    return this.additionalAmounts.reduce((sum, item) => sum + item.amount, 0);
  }

  getTotalAmount(): number {
    const baseAmount = this.loanReceiptForm.get('amount')?.value || 0;
    return baseAmount + this.getTotalAdditional();
  }

  onSave() {
    if (this.loanReceiptForm.valid) {
      const formData = {
        ...this.loanReceiptForm.value,
        additionalAmounts: this.additionalAmounts,
        totalAmount: this.getTotalAmount()
      };
      console.log('Saving loan receipt:', formData);
      alert('Loan receipt saved successfully!');
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  onPrint() {
    console.log('Printing loan receipt');
    window.print();
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this loan receipt?')) {
      this.onNew();
      console.log('Loan receipt deleted');
    }
  }

  onNew() {
    this.loanReceiptForm.reset();
    this.loanReceiptForm.patchValue({
      date: new Date().toISOString().split('T')[0]
    });
    this.additionalAmounts = [];
    this.selectedAddType = '';
    this.additionalAmount = 0;
    console.log('New loan receipt form');
  }

  onClose() {
    console.log('Closing loan receipt form');
    // Navigate back or close modal
  }

  private markFormGroupTouched() {
    Object.keys(this.loanReceiptForm.controls).forEach(key => {
      const control = this.loanReceiptForm.get(key);
      control?.markAsTouched();
    });
  }
}
