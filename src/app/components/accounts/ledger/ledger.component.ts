
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface LedgerEntry {
  id: number;
  date: string;
  voucherNo: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
}

interface LedgerAccount {
  accountName: string;
  accountCode: string;
  accountType: string;
  openingBalance: number;
}

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
      <h1>Ledger Management</h1>
      
      <!-- Account Selection -->
      <mat-card class="selection-card">
        <mat-card-header>
          <mat-card-title>Select Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="selection-row">
            <mat-form-field appearance="outline">
              <mat-label>Select Account</mat-label>
              <mat-select [(value)]="selectedAccount" (selectionChange)="onAccountChange()">
                <mat-option *ngFor="let account of accounts" [value]="account">
                  {{account.accountCode}} - {{account.accountName}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>From Date</mat-label>
              <input matInput [(ngModel)]="fromDate" type="date">
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>To Date</mat-label>
              <input matInput [(ngModel)]="toDate" type="date">
            </mat-form-field>
            
            <button mat-raised-button color="primary" (click)="filterEntries()">
              <mat-icon>search</mat-icon>
              Filter
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- Account Info -->
      <mat-card class="info-card" *ngIf="selectedAccount">
        <mat-card-content>
          <div class="account-info">
            <div class="info-item">
              <strong>Account:</strong> {{selectedAccount.accountCode}} - {{selectedAccount.accountName}}
            </div>
            <div class="info-item">
              <strong>Type:</strong> {{selectedAccount.accountType}}
            </div>
            <div class="info-item">
              <strong>Opening Balance:</strong> ₹{{selectedAccount.openingBalance | number}}
            </div>
            <div class="info-item">
              <strong>Current Balance:</strong> ₹{{currentBalance | number}}
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- Ledger Entries Table -->
      <mat-card class="table-card" *ngIf="selectedAccount">
        <mat-card-header>
          <mat-card-title>Ledger Entries - {{selectedAccount.accountName}}</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="accent" (click)="exportToExcel()">
              <mat-icon>download</mat-icon>
              Export Excel
            </button>
            <button mat-raised-button color="primary" (click)="printLedger()">
              <mat-icon>print</mat-icon>
              Print
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="filteredEntries" class="mat-elevation-z2">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let entry">{{entry.date | date}}</td>
            </ng-container>
            
            <ng-container matColumnDef="voucherNo">
              <th mat-header-cell *matHeaderCellDef>Voucher No.</th>
              <td mat-cell *matCellDef="let entry">{{entry.voucherNo}}</td>
            </ng-container>
            
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let entry">{{entry.description}}</td>
            </ng-container>
            
            <ng-container matColumnDef="debitAmount">
              <th mat-header-cell *matHeaderCellDef>Debit (₹)</th>
              <td mat-cell *matCellDef="let entry">
                {{entry.debitAmount > 0 ? (entry.debitAmount | number) : '-'}}
              </td>
            </ng-container>
            
            <ng-container matColumnDef="creditAmount">
              <th mat-header-cell *matHeaderCellDef>Credit (₹)</th>
              <td mat-cell *matCellDef="let entry">
                {{entry.creditAmount > 0 ? (entry.creditAmount | number) : '-'}}
              </td>
            </ng-container>
            
            <ng-container matColumnDef="balance">
              <th mat-header-cell *matHeaderCellDef>Balance (₹)</th>
              <td mat-cell *matCellDef="let entry" [class.negative-balance]="entry.balance < 0">
                {{entry.balance | number}}
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          
          <!-- Summary -->
          <div class="ledger-summary" *ngIf="filteredEntries.length > 0">
            <div class="summary-item">
              <strong>Total Debit:</strong> ₹{{totalDebit | number}}
            </div>
            <div class="summary-item">
              <strong>Total Credit:</strong> ₹{{totalCredit | number}}
            </div>
            <div class="summary-item">
              <strong>Closing Balance:</strong> ₹{{currentBalance | number}}
            </div>
          </div>
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
    
    .selection-card, .info-card, .table-card {
      margin-bottom: 20px;
    }
    
    .selection-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }
    
    .selection-row mat-form-field {
      flex: 1;
    }
    
    .account-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .info-item {
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
    
    table {
      width: 100%;
    }
    
    .negative-balance {
      color: red;
    }
    
    .ledger-summary {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .summary-item {
      text-align: center;
    }
  `]
})
export class LedgerComponent implements OnInit {
  selectedAccount: LedgerAccount | null = null;
  fromDate = '';
  toDate = '';
  
  accounts: LedgerAccount[] = [];
  ledgerEntries: { [key: string]: LedgerEntry[] } = {};
  filteredEntries: LedgerEntry[] = [];
  
  currentBalance = 0;
  totalDebit = 0;
  totalCredit = 0;
  
  displayedColumns: string[] = ['date', 'voucherNo', 'description', 'debitAmount', 'creditAmount', 'balance'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSampleData();
    this.setDefaultDates();
  }

  setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.fromDate = firstDay.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
  }

  loadSampleData() {
    this.accounts = [
      {
        accountName: 'Cash Account',
        accountCode: 'AC001',
        accountType: 'Asset',
        openingBalance: 50000
      },
      {
        accountName: 'Bank Account',
        accountCode: 'AC002',
        accountType: 'Asset',
        openingBalance: 150000
      },
      {
        accountName: 'Member Deposits',
        accountCode: 'AC003',
        accountType: 'Liability',
        openingBalance: 100000
      },
      {
        accountName: 'Interest Income',
        accountCode: 'AC004',
        accountType: 'Income',
        openingBalance: 0
      }
    ];

    // Sample ledger entries for Cash Account
    this.ledgerEntries['AC001'] = [
      {
        id: 1,
        date: '2024-01-01',
        voucherNo: 'OP001',
        description: 'Opening Balance',
        debitAmount: 50000,
        creditAmount: 0,
        balance: 50000
      },
      {
        id: 2,
        date: '2024-01-15',
        voucherNo: 'RV001',
        description: 'Member deposit received',
        debitAmount: 25000,
        creditAmount: 0,
        balance: 75000
      },
      {
        id: 3,
        date: '2024-01-16',
        voucherNo: 'PV001',
        description: 'Office rent payment',
        debitAmount: 0,
        creditAmount: 15000,
        balance: 60000
      }
    ];

    // Sample ledger entries for Bank Account
    this.ledgerEntries['AC002'] = [
      {
        id: 1,
        date: '2024-01-01',
        voucherNo: 'OP002',
        description: 'Opening Balance',
        debitAmount: 150000,
        creditAmount: 0,
        balance: 150000
      },
      {
        id: 2,
        date: '2024-01-10',
        voucherNo: 'BV001',
        description: 'Loan disbursement',
        debitAmount: 0,
        creditAmount: 100000,
        balance: 50000
      }
    ];
  }

  onAccountChange() {
    if (this.selectedAccount) {
      this.filterEntries();
    }
  }

  filterEntries() {
    if (!this.selectedAccount) return;
    
    const entries = this.ledgerEntries[this.selectedAccount.accountCode] || [];
    
    this.filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const from = this.fromDate ? new Date(this.fromDate) : new Date('1900-01-01');
      const to = this.toDate ? new Date(this.toDate) : new Date('2100-12-31');
      
      return entryDate >= from && entryDate <= to;
    });
    
    this.calculateTotals();
  }

  calculateTotals() {
    this.totalDebit = this.filteredEntries.reduce((sum, entry) => sum + entry.debitAmount, 0);
    this.totalCredit = this.filteredEntries.reduce((sum, entry) => sum + entry.creditAmount, 0);
    
    if (this.filteredEntries.length > 0) {
      this.currentBalance = this.filteredEntries[this.filteredEntries.length - 1].balance;
    } else {
      this.currentBalance = this.selectedAccount?.openingBalance || 0;
    }
  }

  exportToExcel() {
    this.snackBar.open('Exporting ledger to Excel...', 'Close', { duration: 3000 });
  }

  printLedger() {
    this.snackBar.open('Printing ledger report...', 'Close', { duration: 3000 });
  }
}
