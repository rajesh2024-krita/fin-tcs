
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  society: string;
  active: boolean;
  createdDate: Date;
  lastLogin?: Date;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage all system users and their roles
              </p>
            </div>
            <div class="mt-4 sm:mt-0">
              <button
                (click)="openUserDialog()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <mat-icon class="mr-2">add</mat-icon>
                Add User
              </button>
            </div>
          </div>
        </div>

        <!-- Filters Card -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div class="p-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <!-- Search -->
              <div class="lg:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
                </label>
                <div class="relative">
                  <mat-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</mat-icon>
                  <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (input)="applyFilters()"
                    placeholder="Search by name, username, email..."
                    class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <!-- Role Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  [(ngModel)]="selectedRole"
                  (change)="applyFilters()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Roles</option>
                  <option [value]="UserRole.SUPER_ADMIN">Super Admin</option>
                  <option [value]="UserRole.SOCIETY_ADMIN">Society Admin</option>
                  <option [value]="UserRole.BRANCH_ADMIN">Branch Admin</option>
                  <option [value]="UserRole.ACCOUNTANT">Accountant</option>
                  <option [value]="UserRole.OPERATOR">Operator</option>
                  <option [value]="UserRole.MEMBER">Member</option>
                </select>
              </div>

              <!-- Status Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  [(ngModel)]="selectedStatus"
                  (change)="applyFilters()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <button
                (click)="clearFilters()"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <mat-icon class="mr-2">clear</mat-icon>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              System Users ({{filteredUsers.length}})
            </h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role & Society
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">
                            {{getInitials(user.firstName, user.lastName)}}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{user.firstName}} {{user.lastName}}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ '@' + user.username }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{user.email}}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{user.phone}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" [class]="getRoleBadgeClass(user.role)">
                      {{getRoleDisplayName(user.role)}}
                    </span>
                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{user.society}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [class]="user.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                      {{user.active ? 'Active' : 'Inactive'}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{user.lastLogin ? (user.lastLogin | date:'shortDate') : 'Never'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        (click)="openUserDialog(user)"
                        [disabled]="!canEditUser(user)"
                        class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 disabled:opacity-50"
                        matTooltip="Edit User"
                      >
                        <mat-icon class="w-5 h-5">edit</mat-icon>
                      </button>
                      <button
                        (click)="deleteUser(user)"
                        [disabled]="!canDeleteUser(user)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        matTooltip="Delete User"
                      >
                        <mat-icon class="w-5 h-5">delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Empty State -->
            <div *ngIf="filteredUsers.length === 0" class="text-center py-12">
              <mat-icon class="text-6xl text-gray-400 dark:text-gray-500 mb-4">manage_accounts</mat-icon>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6">No users match your current filters.</p>
              <button
                (click)="clearFilters()"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Off-canvas User Form -->
    <div *ngIf="showUserForm" class="fixed inset-0 z-50 overflow-hidden" (click)="closeUserForm()">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="fixed right-0 top-0 h-full w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-800 shadow-xl" (click)="$event.stopPropagation()">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                {{editingUser ? 'Edit User' : 'Add New User'}}
              </h2>
              <button
                (click)="closeUserForm()"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Form Content - Scrollable -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <form [formGroup]="userForm" (ngSubmit)="saveUser()">
              <div class="space-y-6">
                <!-- Username -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    formControlName="username"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    [class.border-red-500]="userForm.get('username')?.invalid && userForm.get('username')?.touched"
                  />
                  <div *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched" class="mt-1 text-sm text-red-600">
                    Username is required
                  </div>
                </div>

                <!-- Name Row -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      formControlName="firstName"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      [class.border-red-500]="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      formControlName="lastName"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      [class.border-red-500]="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    [class.border-red-500]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    formControlName="phone"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    [class.border-red-500]="userForm.get('phone')?.invalid && userForm.get('phone')?.touched"
                  />
                </div>

                <!-- Password (only for new users) -->
                <div *ngIf="!editingUser">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    formControlName="password"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    [class.border-red-500]="userForm.get('password')?.invalid && userForm.get('password')?.touched"
                  />
                  <div *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched" class="mt-1 text-sm text-red-600">
                    Password is required (minimum 6 characters)
                  </div>
                </div>

                <!-- Role and Society -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role *
                    </label>
                    <select
                      formControlName="role"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      [class.border-red-500]="userForm.get('role')?.invalid && userForm.get('role')?.touched"
                    >
                      <option value="">Select Role</option>
                      <option [value]="UserRole.SUPER_ADMIN">Super Admin</option>
                      <option [value]="UserRole.SOCIETY_ADMIN">Society Admin</option>
                      <option [value]="UserRole.BRANCH_ADMIN">Branch Admin</option>
                      <option [value]="UserRole.ACCOUNTANT">Accountant</option>
                      <option [value]="UserRole.OPERATOR">Operator</option>
                      <option [value]="UserRole.MEMBER">Member</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Society *
                    </label>
                    <select
                      formControlName="society"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      [class.border-red-500]="userForm.get('society')?.invalid && userForm.get('society')?.touched"
                    >
                      <option value="">Select Society</option>
                      <option value="Main Branch">Main Branch</option>
                      <option value="North Branch">North Branch</option>
                      <option value="South Branch">South Branch</option>
                    </select>
                  </div>
                </div>

                <!-- Active Status -->
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Status
                    </label>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Enable or disable user access
                    </p>
                  </div>
                  <mat-slide-toggle formControlName="active" color="primary">
                  </mat-slide-toggle>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              type="button"
              (click)="closeUserForm()"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="saveUser()"
              [disabled]="userForm.invalid"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{editingUser ? 'Update User' : 'Create User'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  filteredUsers: User[] = [];
  editingUser: User | null = null;
  showUserForm = false;
  
  // Filter properties
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  
  currentUser: any = null;
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSampleData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      society: ['', Validators.required],
      active: [true]
    });
  }

  loadSampleData() {
    this.users = [
      {
        id: 1,
        username: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'super@admin.com',
        phone: '9876543210',
        role: UserRole.SUPER_ADMIN,
        society: 'Head Office',
        active: true,
        createdDate: new Date('2024-01-01'),
        lastLogin: new Date('2024-01-15')
      },
      {
        id: 2,
        username: 'societyadmin',
        firstName: 'Society',
        lastName: 'Admin',
        email: 'society@admin.com',
        phone: '9876543211',
        role: UserRole.SOCIETY_ADMIN,
        society: 'Main Branch',
        active: true,
        createdDate: new Date('2024-01-05'),
        lastLogin: new Date('2024-01-14')
      },
      {
        id: 3,
        username: 'accountant1',
        firstName: 'John',
        lastName: 'Accountant',
        email: 'john.accountant@company.com',
        phone: '9876543212',
        role: UserRole.ACCOUNTANT,
        society: 'Main Branch',
        active: true,
        createdDate: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-13')
      },
      {
        id: 4,
        username: 'member1',
        firstName: 'Jane',
        lastName: 'Member',
        email: 'jane.member@company.com',
        phone: '9876543213',
        role: UserRole.MEMBER,
        society: 'North Branch',
        active: false,
        createdDate: new Date('2024-01-12')
      }
    ];
    this.filteredUsers = [...this.users];
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const searchMatch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const roleMatch = !this.selectedRole || user.role === this.selectedRole;
      const statusMatch = !this.selectedStatus || 
        (this.selectedStatus === 'active' && user.active) ||
        (this.selectedStatus === 'inactive' && !user.active);
      
      return searchMatch && roleMatch && statusMatch;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.filteredUsers = [...this.users];
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getRoleDisplayName(role: UserRole): string {
    const roleNames: { [key in UserRole]: string } = {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
      [UserRole.SOCIETY_ADMIN]: 'Society Admin',
      [UserRole.BRANCH_ADMIN]: 'Branch Admin',
      [UserRole.ACCOUNTANT]: 'Accountant',
      [UserRole.OPERATOR]: 'Operator',
      [UserRole.MEMBER]: 'Member'
    };
    return roleNames[role] || role;
  }

  getRoleBadgeClass(role: UserRole): string {
    const classes: { [key in UserRole]: string } = {
      [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      [UserRole.SOCIETY_ADMIN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      [UserRole.BRANCH_ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      [UserRole.ACCOUNTANT]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      [UserRole.OPERATOR]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      [UserRole.MEMBER]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
  }

  openUserDialog(user?: User) {
    if (user) {
      this.editingUser = user;
      this.userForm.patchValue(user);
      // Remove password validation for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.editingUser = null;
      this.userForm.reset();
      this.userForm.patchValue({ active: true });
      // Add password validation for new user
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
    this.showUserForm = true;
  }

  closeUserForm() {
    this.showUserForm = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.editingUser) {
        // Update existing user
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        this.users[index] = { 
          ...this.editingUser, 
          ...formValue
        };
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new user
        const newUser: User = {
          id: Date.now(),
          ...formValue,
          createdDate: new Date()
        };
        this.users.push(newUser);
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
      }
      
      this.applyFilters();
      this.closeUserForm();
    } else {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
    }
  }

  canEditUser(user: User): boolean {
    // Super Admin can edit all users
    if (this.currentUser?.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    // Users can't edit other users with higher or same privileges
    return false;
  }

  canDeleteUser(user: User): boolean {
    // Only Super Admin can delete users, and not themselves
    return this.currentUser?.role === UserRole.SUPER_ADMIN && user.id !== this.currentUser?.id;
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.applyFilters();
      this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
    }
  }
}
