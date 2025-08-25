
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';

interface SocietyData {
  id: string;
  name: string;
  registrationNo: string;
  address: string;
  city: string;
  phone: string;
  fax?: string;
  email: string;
  website?: string;
  interests: {
    dividend: number;
    od: number;
    cd: number;
    loan: number;
    emergencyLoan: number;
    las: number;
  };
  limits: {
    share: number;
    loan: number;
    emergencyLoan: number;
  };
  chBounceCharge: number;
  chequeReturnCharge: string;
  cash: number;
  bonus: number;
}

interface ApprovalRequest {
  id: string;
  societyId: string;
  requestedBy: string;
  requestedAt: Date;
  changes: any;
  approvals: {
    userId: string;
    userName: string;
    approved: boolean;
    approvedAt?: Date;
    comments?: string;
  }[];
  totalRequired: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  id: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-society',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule
  ],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="content-header">
        <div class="breadcrumb">
          <span>File</span>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
          <span class="breadcrumb-active">Society</span>
        </div>
        <h1 class="text-page-title">Society Management</h1>
        <p class="text-body text-gray-600 dark:text-gray-400">Manage society information, interest rates, and limits</p>
      </div>

      <!-- Pending Approval Alert -->
      <div *ngIf="pendingRequest" class="card mb-6 border-l-4 border-l-orange-400">
        <div class="card-header bg-gradient-to-r from-orange-500 to-red-500">
          <div class="card-title">
            <mat-icon>pending_actions</mat-icon>
            <span>Pending Approval Request</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <mat-icon class="text-lg">schedule</mat-icon>
            <span>{{ pendingRequest.requestedAt | date:'short' }}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <!-- Request Info -->
            <div>
              <h4 class="text-section-header mb-3">Request Details</h4>
              <div class="space-y-2 text-body">
                <div class="flex justify-between">
                  <span class="text-gray-600">Requested by:</span>
                  <span class="font-medium">{{ pendingRequest.requestedBy }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="badge badge-warning">{{ pendingRequest.status | titlecase }}</span>
                </div>
              </div>
            </div>

            <!-- Approval Progress -->
            <div>
              <h4 class="text-section-header mb-3">Approval Progress</h4>
              <div class="space-y-3">
                <div class="flex justify-between text-body">
                  <span>{{ getApprovedCount() }} of {{ pendingRequest.totalRequired }} approved</span>
                  <span class="font-medium">{{ getApprovalProgress() | number:'1.0-0' }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    [style.width.%]="getApprovalProgress()">
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div>
              <h4 class="text-section-header mb-3">Actions</h4>
              <div class="space-y-2">
                <button 
                  *ngIf="canApprove()" 
                  (click)="openApprovalDialog()"
                  class="btn btn-success btn-sm w-full">
                  <mat-icon class="text-sm">check_circle</mat-icon>
                  Approve Changes
                </button>
                <button class="btn btn-outline btn-sm w-full">
                  <mat-icon class="text-sm">visibility</mat-icon>
                  View Changes
                </button>
              </div>
            </div>
          </div>

          <!-- Approval Status List -->
          <div class="border-t pt-4">
            <h4 class="text-section-header mb-3">Approval Status</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div *ngFor="let approval of pendingRequest.approvals" 
                   class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <mat-icon [class]="approval.approved ? 'text-green-500' : 'text-gray-400'">
                    {{ approval.approved ? 'check_circle' : 'schedule' }}
                  </mat-icon>
                  <div>
                    <p class="font-medium text-sm">{{ approval.userName }}</p>
                    <p class="text-xs text-gray-500">
                      {{ approval.approved ? (approval.approvedAt | date:'short') : 'Pending' }}
                    </p>
                  </div>
                </div>
                <span [class]="approval.approved ? 'badge badge-success' : 'badge badge-secondary'">
                  {{ approval.approved ? 'Approved' : 'Pending' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Society Form -->
      <form [formGroup]="societyForm" class="form-container">
        
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="form-section-header">
            <mat-icon>business</mat-icon>
            <span>Basic Information</span>
          </div>
          <div class="form-section-content">
            <div class="form-grid form-grid-2">
              <div class="form-field">
                <label class="form-label form-label-required">Society Name</label>
                <input 
                  type="text" 
                  class="form-input"
                  formControlName="name"
                  placeholder="Enter society name"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label form-label-required">Registration Number</label>
                <input 
                  type="text" 
                  class="form-input"
                  formControlName="registrationNo"
                  placeholder="Enter registration number"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label form-label-required">Address</label>
                <textarea 
                  class="form-textarea"
                  formControlName="address"
                  placeholder="Enter complete address"
                  [readonly]="!isEditing"
                  rows="3"></textarea>
              </div>
              
              <div class="form-field">
                <label class="form-label form-label-required">City</label>
                <input 
                  type="text" 
                  class="form-input"
                  formControlName="city"
                  placeholder="Enter city name"
                  [readonly]="!isEditing">
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="form-section">
          <div class="form-section-header">
            <mat-icon>contact_phone</mat-icon>
            <span>Contact Information</span>
          </div>
          <div class="form-section-content">
            <div class="form-grid form-grid-2">
              <div class="form-field">
                <label class="form-label form-label-required">Phone</label>
                <input 
                  type="tel" 
                  class="form-input"
                  formControlName="phone"
                  placeholder="+91 9876543210"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Fax</label>
                <input 
                  type="tel" 
                  class="form-input"
                  formControlName="fax"
                  placeholder="+91 2234567890"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label form-label-required">Email</label>
                <input 
                  type="email" 
                  class="form-input"
                  formControlName="email"
                  placeholder="info@society.com"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Website</label>
                <input 
                  type="url" 
                  class="form-input"
                  formControlName="website"
                  placeholder="www.society.com"
                  [readonly]="!isEditing">
              </div>
            </div>
          </div>
        </div>

        <!-- Interest Rates Section -->
        <div class="form-section">
          <div class="form-section-header">
            <mat-icon>trending_up</mat-icon>
            <span>Interest Rates (%)</span>
          </div>
          <div class="form-section-content">
            <div class="form-grid form-grid-3">
              <div class="form-field">
                <label class="form-label">Dividend</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="dividend"
                  placeholder="8.5"
                  step="0.1"
                  min="0"
                  max="100"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Overdraft (OD)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="od"
                  placeholder="12.0"
                  step="0.1"
                  min="0"
                  max="100"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Current Deposit (CD)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="cd"
                  placeholder="6.5"
                  step="0.1"
                  min="0"
                  max="100"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Loan</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="loan"
                  placeholder="10.0"
                  step="0.1"
                  min="0"
                  max="100"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Emergency Loan</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="emergencyLoan"
                  placeholder="15.0"
                  step="0.1"
                  min="0"
                  max="100"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">LAS</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="las"
                  placeholder="7.5"
                  step="0.1"
                  min="0"
                  max="100"
                  [readonly]="!isEditing">
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Limits Section -->
        <div class="form-section">
          <div class="form-section-header">
            <mat-icon>account_balance</mat-icon>
            <span>Financial Limits</span>
          </div>
          <div class="form-section-content">
            <div class="form-grid form-grid-3">
              <div class="form-field">
                <label class="form-label">Share Limit (₹)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="shareLimit"
                  placeholder="500000"
                  min="0"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Loan Limit (₹)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="loanLimit"
                  placeholder="1000000"
                  min="0"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Emergency Loan Limit (₹)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="emergencyLoanLimit"
                  placeholder="200000"
                  min="0"
                  [readonly]="!isEditing">
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Settings Section -->
        <div class="form-section">
          <div class="form-section-header">
            <mat-icon>settings</mat-icon>
            <span>Additional Settings</span>
          </div>
          <div class="form-section-content">
            <div class="form-grid form-grid-4">
              <div class="form-field">
                <label class="form-label">Cheque Bounce Charge (₹)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="chBounceCharge"
                  placeholder="500"
                  min="0"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Cheque Return Charge</label>
                <select class="form-select" formControlName="chequeReturnCharge" [disabled]="!isEditing">
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              
              <div class="form-field">
                <label class="form-label">Cash (₹)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="cash"
                  placeholder="1000"
                  min="0"
                  [readonly]="!isEditing">
              </div>
              
              <div class="form-field">
                <label class="form-label">Bonus (₹)</label>
                <input 
                  type="number" 
                  class="form-input"
                  formControlName="bonus"
                  placeholder="2500"
                  min="0"
                  [readonly]="!isEditing">
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="card-actions">
          <div class="flex justify-end gap-3">
            <button 
              *ngIf="!isEditing" 
              type="button"
              (click)="enableEdit()"
              class="btn btn-primary">
              <mat-icon>edit</mat-icon>
              Edit Society Details
            </button>
            
            <div *ngIf="isEditing" class="flex gap-3">
              <button 
                type="button"
                (click)="cancelEdit()"
                class="btn btn-secondary">
                <mat-icon>close</mat-icon>
                Cancel
              </button>
              <button 
                type="button"
                (click)="saveChanges()"
                [disabled]="societyForm.invalid"
                class="btn btn-success">
                <mat-icon>save</mat-icon>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .content-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border-primary);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .breadcrumb-separator {
      font-size: 1rem;
      color: var(--color-text-light);
    }

    .breadcrumb-active {
      color: var(--color-text-primary);
      font-weight: 500;
    }

    .border-l-4 {
      border-left-width: 4px;
    }

    .border-l-orange-400 {
      border-left-color: #fb923c;
    }

    .grid {
      display: grid;
    }

    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (min-width: 768px) {
      .md\\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }

    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }

    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }

    .p-3 { padding: 0.75rem; }
    .pt-4 { padding-top: 1rem; }

    .w-full { width: 100%; }
    .h-2 { height: 0.5rem; }

    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-200 { background-color: #e5e7eb; }

    .dark .bg-gray-700 { background-color: #374151; }
    .dark .bg-gray-800 { background-color: #1f2937; }

    .rounded-full { border-radius: 9999px; }
    .rounded-lg { border-radius: 0.5rem; }

    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }

    .font-medium { font-weight: 500; }

    .text-gray-400 { color: #9ca3af; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-green-500 { color: #10b981; }

    .transition-all { transition-property: all; }
    .duration-300 { transition-duration: 300ms; }

    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-end { justify-content: flex-end; }

    .border-t { border-top: 1px solid var(--color-border-primary); }
  `]
})
export class SocietyComponent implements OnInit {
  societyForm: FormGroup;
  isEditing = false;
  societyData: SocietyData | null = null;
  pendingRequest: ApprovalRequest | null = null;
  currentUser = { id: 'user1', name: 'John Doe', role: 'society_admin' };
  
  // Mock users who need to approve
  approvalUsers: User[] = [
    { id: 'user1', name: 'John Doe', role: 'society_admin' },
    { id: 'user2', name: 'Jane Smith', role: 'society_admin' },
    { id: 'user3', name: 'Bob Wilson', role: 'super_admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.societyForm = this.createForm();
  }

  ngOnInit() {
    this.loadSocietyData();
    this.loadPendingRequest();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      registrationNo: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      fax: [''],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      dividend: [0, [Validators.min(0), Validators.max(100)]],
      od: [0, [Validators.min(0), Validators.max(100)]],
      cd: [0, [Validators.min(0), Validators.max(100)]],
      loan: [0, [Validators.min(0), Validators.max(100)]],
      emergencyLoan: [0, [Validators.min(0), Validators.max(100)]],
      las: [0, [Validators.min(0), Validators.max(100)]],
      shareLimit: [0, Validators.min(0)],
      loanLimit: [0, Validators.min(0)],
      emergencyLoanLimit: [0, Validators.min(0)],
      chBounceCharge: [0, Validators.min(0)],
      chequeReturnCharge: ['fixed'],
      cash: [0, Validators.min(0)],
      bonus: [0, Validators.min(0)]
    });
  }

  loadSocietyData() {
    // Mock data - replace with actual API call
    this.societyData = {
      id: 'society1',
      name: 'ABC Housing Society',
      address: '123 Main Street, Downtown',
      city: 'Mumbai',
      phone: '+91 9876543210',
      fax: '+91 2234567890',
      email: 'info@abcsociety.com',
      website: 'www.abcsociety.com',
      registrationNo: 'REG123456789',
      interests: {
        dividend: 8.5,
        od: 12.0,
        cd: 6.5,
        loan: 10.0,
        emergencyLoan: 15.0,
        las: 7.5
      },
      limits: {
        share: 500000,
        loan: 1000000,
        emergencyLoan: 200000
      },
      chBounceCharge: 500,
      chequeReturnCharge: 'fixed',
      cash: 1000,
      bonus: 2500
    };

    this.populateForm();
  }

  loadPendingRequest() {
    // Mock pending request - replace with actual API call
    this.pendingRequest = {
      id: 'req1',
      societyId: 'society1',
      requestedBy: 'John Doe',
      requestedAt: new Date(),
      changes: {
        name: 'ABC Premium Housing Society',
        interests: { dividend: 9.0, od: 12.0, cd: 7.0, loan: 10.5, emergencyLoan: 15.5, las: 8.0 }
      },
      approvals: [
        { userId: 'user1', userName: 'John Doe', approved: true, approvedAt: new Date() },
        { userId: 'user2', userName: 'Jane Smith', approved: false },
        { userId: 'user3', userName: 'Bob Wilson', approved: false }
      ],
      totalRequired: 3,
      status: 'pending'
    };
  }

  populateForm() {
    if (this.societyData) {
      this.societyForm.patchValue({
        name: this.societyData.name,
        registrationNo: this.societyData.registrationNo,
        address: this.societyData.address,
        city: this.societyData.city,
        phone: this.societyData.phone,
        fax: this.societyData.fax,
        email: this.societyData.email,
        website: this.societyData.website,
        dividend: this.societyData.interests.dividend,
        od: this.societyData.interests.od,
        cd: this.societyData.interests.cd,
        loan: this.societyData.interests.loan,
        emergencyLoan: this.societyData.interests.emergencyLoan,
        las: this.societyData.interests.las,
        shareLimit: this.societyData.limits.share,
        loanLimit: this.societyData.limits.loan,
        emergencyLoanLimit: this.societyData.limits.emergencyLoan,
        chBounceCharge: this.societyData.chBounceCharge,
        chequeReturnCharge: this.societyData.chequeReturnCharge,
        cash: this.societyData.cash,
        bonus: this.societyData.bonus
      });
    }
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.populateForm(); // Reset form to original values
  }

  saveChanges() {
    if (this.societyForm.valid) {
      // Create approval request
      const changes = this.societyForm.value;
      
      // Simulate creating a new approval request
      this.pendingRequest = {
        id: 'req' + Date.now(),
        societyId: 'society1',
        requestedBy: this.currentUser.name,
        requestedAt: new Date(),
        changes: changes,
        approvals: this.approvalUsers.map(user => ({
          userId: user.id,
          userName: user.name,
          approved: false
        })),
        totalRequired: this.approvalUsers.length,
        status: 'pending'
      };

      this.isEditing = false;
      
      // Show success message
      console.log('Changes saved and sent for approval');
    }
  }

  getApprovedCount(): number {
    return this.pendingRequest?.approvals.filter(a => a.approved).length || 0;
  }

  getPendingCount(): number {
    return this.pendingRequest?.approvals.filter(a => !a.approved).length || 0;
  }

  getApprovalProgress(): number {
    if (!this.pendingRequest) return 0;
    return (this.getApprovedCount() / this.pendingRequest.totalRequired) * 100;
  }

  canApprove(): boolean {
    if (!this.pendingRequest) return false;
    const userApproval = this.pendingRequest.approvals.find(a => a.userId === this.currentUser.id);
    return userApproval ? !userApproval.approved : false;
  }

  openApprovalDialog() {
    // Implementation for approval dialog
    console.log('Opening approval dialog...');
  }

  approveChanges(comments?: string) {
    if (!this.pendingRequest) return;

    const userApproval = this.pendingRequest.approvals.find(a => a.userId === this.currentUser.id);
    if (userApproval) {
      userApproval.approved = true;
      userApproval.approvedAt = new Date();
      userApproval.comments = comments;

      // Check if all approvals are complete
      const allApproved = this.pendingRequest.approvals.every(a => a.approved);
      if (allApproved) {
        // Apply changes to society data
        this.applyPendingChanges();
        this.pendingRequest = null;
      }
    }
  }

  applyPendingChanges() {
    if (!this.pendingRequest || !this.societyData) return;

    // Merge pending changes with society data
    Object.assign(this.societyData, this.pendingRequest.changes);
    this.populateForm();
    
    console.log('All approvals complete. Changes applied successfully!');
  }
}
