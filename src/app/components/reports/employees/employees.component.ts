
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  joinDate: string;
  salary: number;
  status: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
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
      <h1>Employee Reports</h1>
      
      <!-- Filters -->
      <mat-card class="filter-card">
        <mat-card-header>
          <mat-card-title>Report Filters</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="filter-row">
            <mat-form-field appearance="outline">
              <mat-label>Department</mat-label>
              <mat-select [(value)]="selectedDepartment" (selectionChange)="applyFilters()">
                <mat-option value="">All Departments</mat-option>
                <mat-option value="Administration">Administration</mat-option>
                <mat-option value="Finance">Finance</mat-option>
                <mat-option value="Operations">Operations</mat-option>
                <mat-option value="IT">IT</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
                <mat-option value="">All Status</mat-option>
                <mat-option value="Active">Active</mat-option>
                <mat-option value="Inactive">Inactive</mat-option>
                <mat-option value="On Leave">On Leave</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Search Employee</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Name or ID">
            </mat-form-field>
            
            <button mat-raised-button color="primary" (click)="resetFilters()">
              <mat-icon>refresh</mat-icon>
              Reset
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- Export Actions -->
      <mat-card class="actions-card">
        <mat-card-content>
          <div class="export-actions">
            <button mat-raised-button color="accent" (click)="exportToExcel()">
              <mat-icon>file_download</mat-icon>
              Export to Excel
            </button>
            <button mat-raised-button color="accent" (click)="exportToCSV()">
              <mat-icon>file_download</mat-icon>
              Export to CSV
            </button>
            <button mat-raised-button color="primary" (click)="printReport()">
              <mat-icon>print</mat-icon>
              Print Report
            </button>
            <button mat-raised-button color="warn" (click)="exportToPDF()">
              <mat-icon>picture_as_pdf</mat-icon>
              Export to PDF
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- Summary Stats -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number">{{filteredEmployees.length}}</div>
            <div class="stat-label">Total Employees</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number">{{getActiveCount()}}</div>
            <div class="stat-label">Active Employees</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number">₹{{getTotalSalary() | number}}</div>
            <div class="stat-label">Total Salary</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number">{{getAverageSalary() | number}}</div>
            <div class="stat-label">Average Salary</div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Employees Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Employee List ({{filteredEmployees.length}} records)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="filteredEmployees" class="mat-elevation-z2">
            <ng-container matColumnDef="employeeId">
              <th mat-header-cell *matHeaderCellDef>Employee ID</th>
              <td mat-cell *matCellDef="let employee">{{employee.employeeId}}</td>
            </ng-container>
            
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let employee">{{employee.name}}</td>
            </ng-container>
            
            <ng-container matColumnDef="designation">
              <th mat-header-cell *matHeaderCellDef>Designation</th>
              <td mat-cell *matCellDef="let employee">{{employee.designation}}</td>
            </ng-container>
            
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let employee">{{employee.department}}</td>
            </ng-container>
            
            <ng-container matColumnDef="joinDate">
              <th mat-header-cell *matHeaderCellDef>Join Date</th>
              <td mat-cell *matCellDef="let employee">{{employee.joinDate | date}}</td>
            </ng-container>
            
            <ng-container matColumnDef="salary">
              <th mat-header-cell *matHeaderCellDef>Salary</th>
              <td mat-cell *matCellDef="let employee">₹{{employee.salary | number}}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let employee">
                <span [class]="'status-' + employee.status.toLowerCase().replace(' ', '-')">
                  {{employee.status}}
                </span>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let employee">
                <div>{{employee.phone}}</div>
                <div class="email">{{employee.email}}</div>
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
    
    .filter-card, .actions-card, .table-card {
      margin-bottom: 20px;
    }
    
    .filter-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }
    
    .filter-row mat-form-field {
      flex: 1;
    }
    
    .export-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      text-align: center;
    }
    
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #1976d2;
    }
    
    .stat-label {
      color: #666;
      margin-top: 8px;
    }
    
    table {
      width: 100%;
    }
    
    .email {
      font-size: 0.8em;
      color: #666;
    }
    
    .status-active {
      color: green;
      font-weight: bold;
    }
    
    .status-inactive {
      color: red;
      font-weight: bold;
    }
    
    .status-on-leave {
      color: orange;
      font-weight: bold;
    }
  `]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  
  selectedDepartment = '';
  selectedStatus = '';
  searchTerm = '';
  
  displayedColumns: string[] = ['employeeId', 'name', 'designation', 'department', 'joinDate', 'salary', 'status', 'contact'];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadSampleData();
    this.applyFilters();
  }

  loadSampleData() {
    this.employees = [
      {
        id: 1,
        employeeId: 'EMP001',
        name: 'John Smith',
        designation: 'Branch Manager',
        department: 'Administration',
        joinDate: '2022-01-15',
        salary: 75000,
        status: 'Active',
        phone: '9876543210',
        email: 'john.smith@company.com'
      },
      {
        id: 2,
        employeeId: 'EMP002',
        name: 'Sarah Johnson',
        designation: 'Accountant',
        department: 'Finance',
        joinDate: '2022-03-20',
        salary: 45000,
        status: 'Active',
        phone: '9876543211',
        email: 'sarah.johnson@company.com'
      },
      {
        id: 3,
        employeeId: 'EMP003',
        name: 'Michael Brown',
        designation: 'Operations Officer',
        department: 'Operations',
        joinDate: '2023-06-10',
        salary: 35000,
        status: 'On Leave',
        phone: '9876543212',
        email: 'michael.brown@company.com'
      },
      {
        id: 4,
        employeeId: 'EMP004',
        name: 'Emily Davis',
        designation: 'IT Support',
        department: 'IT',
        joinDate: '2023-01-05',
        salary: 40000,
        status: 'Active',
        phone: '9876543213',
        email: 'emily.davis@company.com'
      },
      {
        id: 5,
        employeeId: 'EMP005',
        name: 'David Wilson',
        designation: 'Cashier',
        department: 'Operations',
        joinDate: '2021-11-12',
        salary: 25000,
        status: 'Inactive',
        phone: '9876543214',
        email: 'david.wilson@company.com'
      }
    ];
  }

  applyFilters() {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesDepartment = !this.selectedDepartment || employee.department === this.selectedDepartment;
      const matchesStatus = !this.selectedStatus || employee.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm || 
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesDepartment && matchesStatus && matchesSearch;
    });
  }

  resetFilters() {
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  getActiveCount(): number {
    return this.filteredEmployees.filter(emp => emp.status === 'Active').length;
  }

  getTotalSalary(): number {
    return this.filteredEmployees.reduce((total, emp) => total + emp.salary, 0);
  }

  getAverageSalary(): number {
    return this.filteredEmployees.length > 0 ? this.getTotalSalary() / this.filteredEmployees.length : 0;
  }

  exportToExcel() {
    this.snackBar.open('Exporting employee report to Excel...', 'Close', { duration: 3000 });
    // Simulate Excel export
    this.downloadFile('employees-report.xlsx', 'excel');
  }

  exportToCSV() {
    this.snackBar.open('Exporting employee report to CSV...', 'Close', { duration: 3000 });
    // Simulate CSV export
    const csvContent = this.convertToCSV(this.filteredEmployees);
    this.downloadFile('employees-report.csv', 'csv', csvContent);
  }

  exportToPDF() {
    this.snackBar.open('Exporting employee report to PDF...', 'Close', { duration: 3000 });
    // Simulate PDF export
    this.downloadFile('employees-report.pdf', 'pdf');
  }

  printReport() {
    this.snackBar.open('Printing employee report...', 'Close', { duration: 3000 });
    // Simulate print functionality
    window.print();
  }

  private convertToCSV(data: Employee[]): string {
    const headers = ['Employee ID', 'Name', 'Designation', 'Department', 'Join Date', 'Salary', 'Status', 'Phone', 'Email'];
    const csvRows = [headers.join(',')];
    
    data.forEach(emp => {
      const row = [
        emp.employeeId,
        emp.name,
        emp.designation,
        emp.department,
        emp.joinDate,
        emp.salary.toString(),
        emp.status,
        emp.phone,
        emp.email
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private downloadFile(filename: string, type: string, content?: string) {
    // Simulate file download
    console.log(`Downloading ${filename} as ${type}`);
    if (content) {
      console.log('File content:', content);
    }
  }
}
