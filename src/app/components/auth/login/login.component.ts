
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <mat-icon class="text-3xl text-primary-600">account_balance</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Financial Management System</h1>
          <p class="text-primary-100">Sign in to access your account</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <mat-icon class="text-gray-400">person</mat-icon>
                </div>
                <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Enter your username"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  [class.border-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                >
              </div>
              <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                Username is required
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <mat-icon class="text-gray-400">lock</mat-icon>
                </div>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Enter your password"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="mt-1 text-sm text-red-600 dark:text-red-400">
                Password is required
              </div>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              <mat-spinner *ngIf="loading" diameter="20" class="mr-2"></mat-spinner>
              <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>

          <!-- Demo Accounts -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Demo Accounts</h3>
            <div class="grid grid-cols-1 gap-2">
              <button
                *ngFor="let account of demoAccounts"
                (click)="loginWithDemo(account.username)"
                class="flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ account.role }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ account.username }}</div>
                </div>
                <mat-icon class="text-gray-400">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-sm text-primary-100">
            Secure financial management for your society
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mat-mdc-progress-spinner {
      --mdc-circular-progress-active-indicator-color: white;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;
  returnUrl: string = '/dashboard';

  demoAccounts = [
    { role: 'Super Admin', username: 'superadmin' },
    { role: 'Society Admin', username: 'societyadmin' },
    { role: 'Accountant', username: 'accountant1' },
    { role: 'Member', username: 'member1' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Redirect if already logged in
    if (this.authService.getCurrentUser()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginWithDemo(username: string) {
    console.log(username)
    this.loginForm.patchValue({
      username: username,
      password: 'password'
    });
    this.onSubmit();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { username, password } = this.loginForm.value;
    console.log('username == ', username)
    console.log('password == ', password)
    this.authService.login(username, password).subscribe({
      next: (success:any) => {
        this.loading = false;
        if (success) {
          const user = this.authService.getCurrentUser();
          this.snackBar.open(`Welcome ${user?.firstName} ${user?.lastName}!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate([this.returnUrl]);
        } else {
          this.snackBar.open('Invalid username or password', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Login failed. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
