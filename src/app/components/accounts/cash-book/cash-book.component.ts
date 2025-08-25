
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

interface CashBookEntry {
  id: number;
  date: Date;
  particulars: string;
  voucherNo: string;
  type: 'Receipt' | 'Payment';
  amount: number;
  balance: number;
  description: string;
}

@Component({
  selector: 'app-cash-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  template: `
    <div class="page-container">
      <h1>Cash Book Management</h1>
      
      <mat-tab-group>
        <!-- Cash Entry Tab -->
        <mat-tab label="Cash Entry">
          <mat-card class="form-card">
            <mat-card-header>
              <mat-card-title>{{editingEntry ? 'Edit Cash Entry' : 'New Cash Entry'}}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="cashForm" (ngSubmit)="saveEntry()">
                <div class="form-grid">
                  <mat-form-field>
                    <mat-label>Date</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="date" required>
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>
                  
                  <mat-form-field>
                    <mat-label>Voucher No</mat-label>
                    <input matInput formControlName="voucherNo" required>
                  </mat-form-field>
                  
                  <mat-form-field>
                    <mat-label>Type</mat-label>
                    <mat-select formControlName="type" required>
                      <mat-option value="Receipt">Cash Receipt</mat-option>
                      <mat-option value="Payment">Cash Payment</mat-option>
                    </mat-select>
                  </mat-form-field>
                  
                  <mat-form-field>
                    <mat-label>Amount</mat-label>
                    <input matInput type="number" formControlName="amount" required min="0.01" step="0.01">
                  </mat-form-field>
                  
                  <mat-form-field class="full-width">
                    <mat-label>Particulars</mat-label>
                    <input matInput formControlName="particulars" required>
                  </mat-form-field>
                  
                  <mat-form-field class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="3"></textarea>
                  </mat-form-field>
                </div>
                
                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="!cashForm.valid">
                    {{editingEntry ? 'Update Entry' : 'Add Entry'}}
                  </button>
                  <button mat-button type="button" (click)="resetForm()" *ngIf="editingEntry">
                    Cancel
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <!-- Cash Book View Tab -->
        <mat-tab label="Cash Book">
          <mat-card class="table-card">
            <mat-card-header>
              <mat-card-title>Cash Book Entries</mat-card-title>
              <div class="card-actions">
                <mat-form-field class="date-filter">
                  <mat-label>From Date</mat-label>
                  <input matInput [matDatepicker]="fromPicker" [(ngModel)]="fromDate" (dateChange)="filterEntries()">
                  <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
                  <mat-datepicker #fromPicker></mat-datepicker>
                </mat-form-field>
                <mat-form-field class="date-filter">
                  <mat-label>To Date</mat-label>
                  <input matInput [matDatepicker]="toPicker" [(ngModel)]="toDate" (dateChange)="filterEntries()">
                  <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
                  <mat-datepicker #toPicker></mat-datepicker>
                </mat-form-field>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="summary-cards">
                <div class="summary-card receipt">
                  <h3>Total Receipts</h3>
                  <p>₹{{totalReceipts | number:'1.2-2'}}</p>
                </div>
                <div class="summary-card payment">
                  <h3>Total Payments</h3>
                  <p>₹{{totalPayments | number:'1.2-2'}}</p>
                </div>
                <div class="summary-card balance">
                  <h3>Closing Balance</h3>
                  <p>₹{{closingBalance | number:'1.2-2'}}</p>
                </div>
              </div>
              
              <div class="table-container">
                <table mat-table [dataSource]="filteredEntries" class="cash-book-table">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let entry">{{entry.date | date:'dd/MM/yyyy'}}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="voucherNo">
                    <th mat-header-cell *matHeaderCellDef>Voucher No</th>
                    <td mat-cell *matCellDef="let entry">{{entry.voucherNo}}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="particulars">
                    <th mat-header-cell *matHeaderCellDef>Particulars</th>
                    <td mat-cell *matCellDef="let entry">{{entry.particulars}}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="receipt">
                    <th mat-header-cell *matHeaderCellDef>Receipt</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell receipt">
                      {{entry.type === 'Receipt' ? (entry.amount | number:'1.2-2') : ''}}
                    </td>
                  </ng-container>
                  
                  <ng-container matColumnDef="payment">
                    <th mat-header-cell *matHeaderCellDef>Payment</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell payment">
                      {{entry.type === 'Payment' ? (entry.amount | number:'1.2-2') : ''}}
                    </td>
                  </ng-container>
                  
                  <ng-container matColumnDef="balance">
                    <th mat-header-cell *matHeaderCellDef>Balance</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell balance">
                      {{entry.balance | number:'1.2-2'}}
                    </td>
                  </ng-container>
                  
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let entry">
                      <button mat-icon-button (click)="editEntry(entry)" color="primary">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="deleteEntry(entry.id)" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                      [class.receipt-row]="row.type === 'Receipt'"
                      [class.payment-row]="row.type === 'Payment'"></tr>
                </table>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <!-- Reports Tab -->
        <mat-tab label="Reports">
          <mat-card class="report-card">
            <mat-card-header>
              <mat-card-title>Cash Book Reports</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="report-buttons">
                <button mat-raised-button color="primary" (click)="printCashBook()">
                  <mat-icon>print</mat-icon>
                  Print Cash Book
                </button>
                <button mat-raised-button color="accent" (click)="exportToExcel()">
                  <mat-icon>download</mat-icon>
                  Export to Excel
                </button>
                <button mat-raised-button (click)="generateSummary()">
                  <mat-icon>assessment</mat-icon>
                  Generate Summary
                </button>
              </div>
              
              <div class="monthly-summary" *ngIf="monthlySummary">
                <h3>Monthly Summary</h3>
                <div class="summary-grid">
                  <div class="summary-item">
                    <label>Opening Balance:</label>
                    <span>₹{{monthlySummary.openingBalance | number:'1.2-2'}}</span>
                  </div>
                  <div class="summary-item">
                    <label>Total Receipts:</label>
                    <span>₹{{monthlySummary.totalReceipts | number:'1.2-2'}}</span>
                  </div>
                  <div class="summary-item">
                    <label>Total Payments:</label>
                    <span>₹{{monthlySummary.totalPayments | number:'1.2-2'}}</span>
                  </div>
                  <div class="summary-item">
                    <label>Closing Balance:</label>
                    <span>₹{{monthlySummary.closingBalance | number:'1.2-2'}}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-card, .table-card, .report-card {
      margin: 20px 0;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .card-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .date-filter {
      width: 150px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .summary-card {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      color: white;
    }
    
    .summary-card.receipt {
      background-color: #4caf50;
    }
    
    .summary-card.payment {
      background-color: #f44336;
    }
    
    .summary-card.balance {
      background-color: #2196f3;
    }
    
    .summary-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
    }
    
    .summary-card p {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .cash-book-table {
      width: 100%;
    }
    
    .amount-cell {
      text-align: right;
      font-weight: 500;
    }
    
    .amount-cell.receipt {
      color: #4caf50;
    }
    
    .amount-cell.payment {
      color: #f44336;
    }
    
    .amount-cell.balance {
      color: #2196f3;
      font-weight: bold;
    }
    
    .receipt-row {
      background-color: #e8f5e8;
    }
    
    .payment-row {
      background-color: #fdeaea;
    }
    
    .report-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .monthly-summary {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    
    .summary-item label {
      font-weight: 500;
    }
    
    .summary-item span {
      font-weight: bold;
      color: #2196f3;
    }
  `]
})
export class CashBookComponent implements OnInit {
  cashForm: FormGroup;
  entries: CashBookEntry[] = [];
  filteredEntries: CashBookEntry[] = [];
  displayedColumns = ['date', 'voucherNo', 'particulars', 'receipt', 'payment', 'balance', 'actions'];
  editingEntry: CashBookEntry | null = null;
  
  fromDate: Date | null = null;
  toDate: Date | null = null;
  
  totalReceipts = 0;
  totalPayments = 0;
  closingBalance = 0;
  
  monthlySummary: any = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.cashForm = this.createForm();
  }

  ngOnInit() {
    this.loadSampleData();
    this.calculateSummary();
    this.setDefaultDateRange();
  }

  createForm(): FormGroup {
    return this.fb.group({
      date: [new Date(), Validators.required],
      voucherNo: ['', Validators.required],
      type: ['Receipt', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      particulars: ['', Validators.required],
      description: ['']
    });
  }

  setDefaultDateRange() {
    const today = new Date();
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.filterEntries();
  }

  loadSampleData() {
    let balance = 10000; // Opening balance
    
    this.entries = [
      {
        id: 1,
        date: new Date('2024-01-01'),
        particulars: 'Opening Balance',
        voucherNo: 'OB001',
        type: 'Receipt',
        amount: 10000,
        balance: balance,
        description: 'Opening balance for the year'
      },
      {
        id: 2,
        date: new Date('2024-01-02'),
        particulars: 'Member Deposit - John Doe',
        voucherNo: 'CR001',
        type: 'Receipt',
        amount: 50000,
        balance: balance + 50000,
        description: 'Fixed deposit by member'
      },
      {
        id: 3,
        date: new Date('2024-01-03'),
        particulars: 'Office Rent',
        voucherNo: 'CP001',
        type: 'Payment',
        amount: 15000,
        balance: balance + 50000 - 15000,
        description: 'Monthly office rent payment'
      }
    ];
    
    this.filteredEntries = [...this.entries];
  }

  saveEntry() {
    if (this.cashForm.valid) {
      const formValue = this.cashForm.value;
      
      if (this.editingEntry) {
        const index = this.entries.findIndex(e => e.id === this.editingEntry!.id);
        this.entries[index] = { ...this.editingEntry, ...formValue };
        this.snackBar.open('Entry updated successfully', 'Close', { duration: 3000 });
      } else {
        const newEntry: CashBookEntry = {
          id: Date.now(),
          ...formValue,
          balance: this.calculateRunningBalance(formValue)
        };
        this.entries.push(newEntry);
        this.snackBar.open('Entry added successfully', 'Close', { duration: 3000 });
      }
      
      this.sortAndRecalculateBalances();
      this.filterEntries();
      this.calculateSummary();
      this.resetForm();
    }
  }

  calculateRunningBalance(entry: any): number {
    const lastBalance = this.entries.length > 0 ? 
      Math.max(...this.entries.map(e => e.balance)) : 0;
    
    return entry.type === 'Receipt' ? 
      lastBalance + entry.amount : 
      lastBalance - entry.amount;
  }

  sortAndRecalculateBalances() {
    this.entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    this.entries.forEach(entry => {
      if (entry.particulars === 'Opening Balance') {
        runningBalance = entry.amount;
      } else {
        runningBalance += entry.type === 'Receipt' ? entry.amount : -entry.amount;
      }
      entry.balance = runningBalance;
    });
  }

  editEntry(entry: CashBookEntry) {
    this.editingEntry = entry;
    this.cashForm.patchValue(entry);
  }

  deleteEntry(id: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entries = this.entries.filter(e => e.id !== id);
      this.sortAndRecalculateBalances();
      this.filterEntries();
      this.calculateSummary();
      this.snackBar.open('Entry deleted successfully', 'Close', { duration: 3000 });
    }
  }

  resetForm() {
    this.editingEntry = null;
    this.cashForm.reset();
    this.cashForm.patchValue({
      date: new Date(),
      type: 'Receipt'
    });
  }

  filterEntries() {
    if (this.fromDate && this.toDate) {
      this.filteredEntries = this.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= this.fromDate! && entryDate <= this.toDate!;
      });
    } else {
      this.filteredEntries = [...this.entries];
    }
    this.calculateSummary();
  }

  calculateSummary() {
    this.totalReceipts = this.filteredEntries
      .filter(e => e.type === 'Receipt')
      .reduce((sum, e) => sum + e.amount, 0);
    
    this.totalPayments = this.filteredEntries
      .filter(e => e.type === 'Payment')
      .reduce((sum, e) => sum + e.amount, 0);
    
    this.closingBalance = this.filteredEntries.length > 0 ? 
      this.filteredEntries[this.filteredEntries.length - 1].balance : 0;
  }

  printCashBook() {
    this.snackBar.open('Print functionality will be implemented', 'Close', { duration: 2000 });
  }

  exportToExcel() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 2000 });
  }

  generateSummary() {
    const openingBalance = this.entries.find(e => e.particulars === 'Opening Balance')?.amount || 0;
    
    this.monthlySummary = {
      openingBalance: openingBalance,
      totalReceipts: this.totalReceipts,
      totalPayments: this.totalPayments,
      closingBalance: this.closingBalance
    };
    
    this.snackBar.open('Summary generated successfully', 'Close', { duration: 2000 });
  }
}
