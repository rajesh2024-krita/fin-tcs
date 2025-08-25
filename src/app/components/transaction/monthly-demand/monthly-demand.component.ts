
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

interface DemandRecord {
  edpNo: string;
  memberName: string;
  loanAmt: number;
  cd: number;
  loan: number;
  interest: number;
  eLoan: number;
  eInterest: number;
  net: number;
  intDue: number;
  pInt: number;
  pDed: number;
  las: number;
  int: number;
  lasIntDue: number;
}

interface LoanInterestRecord {
  edpNo: string;
  memberName: string;
  loanIntAmt: number;
}

@Component({
  selector: 'app-monthly-demand',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule
  ],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="content-header mb-6">
        <div class="breadcrumb">
          <span>Transaction</span>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
          <span class="breadcrumb-active">Monthly Demand Processing</span>
        </div>
        <h1 class="text-page-title">Monthly Demand Processing</h1>
        <p class="text-body text-gray-600 dark:text-gray-400">Process monthly loan demands and interest calculations</p>
      </div>

      <!-- Month Selection -->
      <mat-card class="card mb-6">
        <div class="card-header bg-gradient-to-r from-blue-600 to-purple-600">
          <div class="card-title">
            <mat-icon>calendar_month</mat-icon>
            <span>Month Selection</span>
          </div>
        </div>
        <mat-card-content class="p-6">
          <div class="form-grid form-grid-3">
            <div class="form-field">
              <label class="form-label form-label-required">Processing Month</label>
              <select class="form-select" [(ngModel)]="selectedMonth" (change)="loadMonthData()">
                <option value="">Select Month</option>
                <option value="2024-01">January 2024</option>
                <option value="2024-02">February 2024</option>
                <option value="2024-03">March 2024</option>
                <option value="2024-04">April 2024</option>
                <option value="2024-05">May 2024</option>
                <option value="2024-06">June 2024</option>
                <option value="2024-07">July 2024</option>
                <option value="2024-08">August 2024</option>
                <option value="2024-09">September 2024</option>
                <option value="2024-10">October 2024</option>
                <option value="2024-11">November 2024</option>
                <option value="2024-12">December 2024</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label">Status</label>
              <input type="text" class="form-input" [value]="monthStatus" readonly>
            </div>
            <div class="form-field">
              <label class="form-label">Last Processed</label>
              <input type="text" class="form-input" [value]="lastProcessed" readonly>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Demand Table Section -->
      <mat-card class="card mb-6">
        <div class="card-header bg-gradient-to-r from-green-600 to-blue-600">
          <div class="card-title">
            <mat-icon>table_view</mat-icon>
            <span>Monthly Demand Table</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-sm btn-primary" (click)="calculateInterest()">
              <mat-icon>calculate</mat-icon>
              Calculate Interest
            </button>
            <button type="button" class="btn btn-sm btn-success" (click)="postInterest()" [disabled]="!canPostInterest()">
              <mat-icon>post_add</mat-icon>
              Interest Post
            </button>
          </div>
        </div>

        <mat-card-content class="p-0">
          <mat-tab-group class="demand-tabs">
            <mat-tab label="Demand Processing">
              <div class="tab-content">
                <div class="table-container">
                  <table class="demand-table">
                    <thead>
                      <tr>
                        <th>EDP No.</th>
                        <th>Member Name</th>
                        <th>Loan Amt</th>
                        <th>CD</th>
                        <th>Loan</th>
                        <th>Interest</th>
                        <th>E-Loan</th>
                        <th>Interest...</th>
                        <th>Net...</th>
                        <th>IntDue</th>
                        <th>PInt</th>
                        <th>PDed</th>
                        <th>LAS</th>
                        <th>Int</th>
                        <th>LASIntDue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let record of demandRecords; let i = index" [class.selected-row]="selectedRowIndex === i" (click)="selectRow(i, record)">
                        <td>{{record.edpNo}}</td>
                        <td>{{record.memberName}}</td>
                        <td class="number-cell">{{record.loanAmt | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.cd | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.loan | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell interest-cell">{{record.interest | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.eLoan | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell interest-cell">{{record.eInterest | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.net | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.intDue | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.pInt | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.pDed | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.las | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.int | currency:'INR':'symbol':'1.2-2'}}</td>
                        <td class="number-cell">{{record.lasIntDue | currency:'INR':'symbol':'1.2-2'}}</td>
                      </tr>
                      <tr *ngIf="demandRecords.length === 0">
                        <td colspan="15" class="text-center text-gray-500 py-8">No demand records found for selected month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Total Interest Summary -->
                <div class="summary-panel">
                  <div class="summary-item">
                    <label>Total Interest:</label>
                    <span class="total-amount">{{getTotalInterest() | currency:'INR':'symbol':'1.2-2'}}</span>
                  </div>
                  <div class="summary-item">
                    <label>Total E-Interest:</label>
                    <span class="total-amount">{{getTotalEInterest() | currency:'INR':'symbol':'1.2-2'}}</span>
                  </div>
                  <div class="summary-item">
                    <label>Total Amount Due:</label>
                    <span class="total-amount">{{getTotalAmountDue() | currency:'INR':'symbol':'1.2-2'}}</span>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Month Closing">
              <div class="tab-content">
                <div class="closing-panel">
                  <div class="closing-stats">
                    <div class="stat-card">
                      <div class="stat-value">{{demandRecords.length}}</div>
                      <div class="stat-label">Total Members</div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-value">{{getTotalInterest() | currency:'INR':'symbol':'1.0-0'}}</div>
                      <div class="stat-label">Total Interest</div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-value">{{getProcessedCount()}}</div>
                      <div class="stat-label">Processed</div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-value">{{getPendingCount()}}</div>
                      <div class="stat-label">Pending</div>
                    </div>
                  </div>

                  <div class="closing-actions">
                    <button type="button" class="btn btn-warning" (click)="validateMonth()">
                      <mat-icon>check_circle</mat-icon>
                      Validate Month
                    </button>
                    <button type="button" class="btn btn-success" (click)="closeMonth()" [disabled]="!canCloseMonth()">
                      <mat-icon>lock</mat-icon>
                      Close Month
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Loan Interest Summary">
              <div class="tab-content">
                <div class="table-container">
                  <table class="interest-summary-table">
                    <thead>
                      <tr>
                        <th>EDP No.</th>
                        <th>Member Name</th>
                        <th>Loan Int Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let record of loanInterestRecords">
                        <td>{{record.edpNo}}</td>
                        <td>{{record.memberName}}</td>
                        <td class="number-cell">{{record.loanIntAmt | currency:'INR':'symbol':'1.2-2'}}</td>
                      </tr>
                      <tr class="total-row">
                        <td colspan="2"><strong>Total</strong></td>
                        <td class="number-cell"><strong>{{getLoanInterestTotal() | currency:'INR':'symbol':'1.2-2'}}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>

      <!-- Member Detail Fields Section -->
      <form [formGroup]="memberForm">
        <mat-card class="card">
          <div class="card-header bg-gradient-to-r from-purple-600 to-pink-600">
            <div class="card-title">
              <mat-icon>person</mat-icon>
              <span>Member Detail Entry</span>
            </div>
          </div>

          <mat-card-content class="p-6">
            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>account_circle</mat-icon>
                <span>Basic Information</span>
              </div>
              <div class="form-section-content">
                <div class="form-grid form-grid-4">
                  <div class="form-field">
                    <label class="form-label form-label-required">EDP No.</label>
                    <input 
                      type="text" 
                      class="form-input"
                      formControlName="edpNo"
                      placeholder="Enter EDP number">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Name</label>
                    <input 
                      type="text" 
                      class="form-input"
                      formControlName="name"
                      placeholder="Member name"
                      readonly>
                  </div>

                  <div class="form-field">
                    <label class="form-label">Loan</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="loan"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Emrg. Loan</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="emergencyLoan"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>payments</mat-icon>
                <span>Interest & Deductions</span>
              </div>
              <div class="form-section-content">
                <div class="form-grid form-grid-4">
                  <div class="form-field">
                    <label class="form-label">Int Due</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="intDue"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">LAS Int Due</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="lasIntDue"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">CD</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="cd"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Interest</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="interest"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">P. Int</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="pInt"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">LAS</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="las"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">Interest</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="interestSecond"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>

                  <div class="form-field">
                    <label class="form-label">P. Ded</label>
                    <input 
                      type="number" 
                      class="form-input"
                      formControlName="pDed"
                      placeholder="0.00"
                      (input)="calculateTotals()">
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="form-section-header">
                <mat-icon>calculate</mat-icon>
                <span>Calculated Total</span>
              </div>
              <div class="form-section-content">
                <div class="form-field">
                  <label class="form-label">Total Amount</label>
                  <input 
                    type="number" 
                    class="form-input total-field"
                    formControlName="totalAmount"
                    readonly>
                </div>
              </div>
            </div>
          </mat-card-content>

          <!-- Action Buttons -->
          <div class="card-actions">
            <div class="btn-group">
              <button type="button" class="btn btn-secondary" (click)="clearMemberForm()">
                <mat-icon>clear</mat-icon>
                Clear
              </button>
              <button type="button" class="btn btn-success" (click)="exportToExcel()">
                <mat-icon>file_download</mat-icon>
                Excel
              </button>
              <button type="button" class="btn btn-info" (click)="printDemandTable()">
                <mat-icon>print</mat-icon>
                Print
              </button>
              <button type="button" class="btn btn-warning" (click)="printLoanDetails()">
                <mat-icon>description</mat-icon>
                Print Loan
              </button>
            </div>
            <div class="btn-group">
              <button type="button" class="btn btn-primary" (click)="saveMemberData()">
                <mat-icon>save</mat-icon>
                Save
              </button>
              <button type="button" class="btn btn-danger" (click)="resetAll()">
                <mat-icon>refresh</mat-icon>
                Reset
              </button>
              <button type="button" class="btn btn-secondary" (click)="closeForm()">
                <mat-icon>close</mat-icon>
                Close
              </button>
            </div>
          </div>
        </mat-card>
      </form>
    </div>
  `,
  styleUrl: './monthly-demand.component.css'
})
export class MonthlyDemandComponent implements OnInit {
  memberForm: FormGroup;
  selectedMonth = '';
  monthStatus = 'Open';
  lastProcessed = 'Not processed';
  selectedRowIndex = -1;
  
  demandRecords: DemandRecord[] = [
    {
      edpNo: 'EMP001',
      memberName: 'John Doe',
      loanAmt: 50000,
      cd: 5000,
      loan: 45000,
      interest: 2250,
      eLoan: 10000,
      eInterest: 500,
      net: 42750,
      intDue: 1750,
      pInt: 500,
      pDed: 1250,
      las: 1000,
      int: 50,
      lasIntDue: 50
    },
    {
      edpNo: 'EMP002',
      memberName: 'Jane Smith',
      loanAmt: 75000,
      cd: 7500,
      loan: 67500,
      interest: 3375,
      eLoan: 15000,
      eInterest: 750,
      net: 63750,
      intDue: 2625,
      pInt: 750,
      pDed: 1875,
      las: 1500,
      int: 75,
      lasIntDue: 75
    },
    {
      edpNo: 'EMP003',
      memberName: 'Mike Johnson',
      loanAmt: 30000,
      cd: 3000,
      loan: 27000,
      interest: 1350,
      eLoan: 5000,
      eInterest: 250,
      net: 25650,
      intDue: 1100,
      pInt: 250,
      pDed: 850,
      las: 500,
      int: 25,
      lasIntDue: 25
    }
  ];

  loanInterestRecords: LoanInterestRecord[] = [];

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      edpNo: ['', Validators.required],
      name: [''],
      loan: [0],
      emergencyLoan: [0],
      intDue: [0],
      lasIntDue: [0],
      cd: [0],
      interest: [0],
      pInt: [0],
      las: [0],
      interestSecond: [0],
      pDed: [0],
      totalAmount: [0]
    });
  }

  ngOnInit() {
    this.generateLoanInterestRecords();
  }

  loadMonthData() {
    if (this.selectedMonth) {
      // Simulate loading data for selected month
      this.monthStatus = 'Open';
      this.lastProcessed = 'Not processed';
      console.log('Loading data for month:', this.selectedMonth);
    }
  }

  selectRow(index: number, record: DemandRecord) {
    this.selectedRowIndex = index;
    this.memberForm.patchValue({
      edpNo: record.edpNo,
      name: record.memberName,
      loan: record.loan,
      emergencyLoan: record.eLoan,
      intDue: record.intDue,
      lasIntDue: record.lasIntDue,
      cd: record.cd,
      interest: record.interest,
      pInt: record.pInt,
      las: record.las,
      interestSecond: record.int,
      pDed: record.pDed
    });
    this.calculateTotals();
  }

  calculateInterest() {
    // Simulate interest calculation
    this.demandRecords.forEach(record => {
      const interestRate = 0.05; // 5% monthly interest
      record.interest = record.loan * interestRate;
      record.eInterest = record.eLoan * interestRate;
      record.intDue = record.interest - record.pInt;
    });
    this.generateLoanInterestRecords();
    alert('Interest calculated for all members');
  }

  postInterest() {
    if (this.canPostInterest()) {
      // Simulate posting interest
      alert(`Interest of ₹${this.getTotalInterest().toFixed(2)} posted successfully`);
      this.monthStatus = 'Interest Posted';
    }
  }

  canPostInterest(): boolean {
    return this.selectedMonth !== '' && this.getTotalInterest() > 0;
  }

  validateMonth() {
    // Simulate month validation
    const validationErrors = [];
    if (this.demandRecords.some(r => r.interest === 0)) {
      validationErrors.push('Some members have zero interest');
    }
    
    if (validationErrors.length > 0) {
      alert('Validation errors found:\n' + validationErrors.join('\n'));
    } else {
      alert('Month validation successful');
    }
  }

  closeMonth() {
    if (this.canCloseMonth()) {
      if (confirm('Are you sure you want to close this month? This action cannot be undone.')) {
        this.monthStatus = 'Closed';
        alert('Month closed successfully');
      }
    }
  }

  canCloseMonth(): boolean {
    return this.monthStatus === 'Interest Posted';
  }

  calculateTotals() {
    const formValues = this.memberForm.value;
    const total = 
      (formValues.loan || 0) + 
      (formValues.emergencyLoan || 0) + 
      (formValues.intDue || 0) + 
      (formValues.lasIntDue || 0) + 
      (formValues.interest || 0) + 
      (formValues.interestSecond || 0);
    
    this.memberForm.patchValue({ totalAmount: total });
  }

  getTotalInterest(): number {
    return this.demandRecords.reduce((sum, record) => sum + record.interest, 0);
  }

  getTotalEInterest(): number {
    return this.demandRecords.reduce((sum, record) => sum + record.eInterest, 0);
  }

  getTotalAmountDue(): number {
    return this.demandRecords.reduce((sum, record) => sum + record.intDue + record.lasIntDue, 0);
  }

  getProcessedCount(): number {
    return this.demandRecords.filter(r => r.interest > 0).length;
  }

  getPendingCount(): number {
    return this.demandRecords.filter(r => r.interest === 0).length;
  }

  generateLoanInterestRecords() {
    this.loanInterestRecords = this.demandRecords.map(record => ({
      edpNo: record.edpNo,
      memberName: record.memberName,
      loanIntAmt: record.interest + record.eInterest
    }));
  }

  getLoanInterestTotal(): number {
    return this.loanInterestRecords.reduce((sum, record) => sum + record.loanIntAmt, 0);
  }

  clearMemberForm() {
    this.memberForm.reset();
    this.selectedRowIndex = -1;
  }

  exportToExcel() {
    // Simulate Excel export
    const csvContent = this.generateCSVContent();
    console.log('Exporting to Excel:', csvContent);
    alert('Demand table exported to Excel successfully');
  }

  printDemandTable() {
    window.print();
  }

  printLoanDetails() {
    if (this.selectedRowIndex >= 0) {
      const selectedRecord = this.demandRecords[this.selectedRowIndex];
      console.log('Printing loan details for:', selectedRecord.memberName);
      alert(`Printing loan details for ${selectedRecord.memberName}`);
    } else {
      alert('Please select a member first');
    }
  }

  saveMemberData() {
    if (this.memberForm.valid) {
      const formData = this.memberForm.value;
      if (this.selectedRowIndex >= 0) {
        // Update existing record
        const record = this.demandRecords[this.selectedRowIndex];
        record.loan = formData.loan;
        record.eLoan = formData.emergencyLoan;
        record.cd = formData.cd;
        record.interest = formData.interest;
        record.intDue = formData.intDue;
        record.lasIntDue = formData.lasIntDue;
      }
      alert('Member data saved successfully');
    } else {
      alert('Please fill all required fields');
    }
  }

  resetAll() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      this.clearMemberForm();
      this.selectedMonth = '';
      this.monthStatus = 'Open';
      this.lastProcessed = 'Not processed';
      // Reset all calculations
      this.demandRecords.forEach(record => {
        record.interest = 0;
        record.eInterest = 0;
        record.intDue = 0;
      });
      this.generateLoanInterestRecords();
    }
  }

  closeForm() {
    if (confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
      this.clearMemberForm();
    }
  }

  private generateCSVContent(): string {
    const headers = ['EDP No.', 'Member Name', 'Loan Amt', 'CD', 'Loan', 'Interest', 'E-Loan', 'Interest...', 'Net...', 'IntDue', 'PInt', 'PDed', 'LAS', 'Int', 'LASIntDue'];
    const rows = this.demandRecords.map(record => [
      record.edpNo, record.memberName, record.loanAmt, record.cd, record.loan,
      record.interest, record.eLoan, record.eInterest, record.net, record.intDue,
      record.pInt, record.pDed, record.las, record.int, record.lasIntDue
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
