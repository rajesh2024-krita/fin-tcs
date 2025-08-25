
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, Event } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import { MatDividerModule } from '@angular/material/divider';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  badge?: number;
  divider?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <div class="layout-container">
      <mat-sidenav-container class="sidenav-container">
        <!-- Professional Sidebar -->
        <mat-sidenav #drawer
                     [mode]="isMobile ? 'over' : 'side'"
                     [opened]="!isMobile"
                     class="sidebar-professional">
          
          <!-- Sidebar Header -->
          <div class="sidebar-header">
            <div class="flex items-center space-x-3 p-4">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <mat-icon class="text-white text-xl">account_balance</mat-icon>
              </div>
              <div class="flex-1">
                <h2 class="text-white font-bold text-lg">FinTCS</h2>
                <p class="text-white/70 text-xs">Financial Management</p>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="sidebar-nav">
            <!-- Dashboard Section -->
            <div class="nav-section">
              <div class="nav-section-header">Dashboard</div>
              <a routerLink="/dashboard" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>dashboard</mat-icon>
                <span>Overview</span>
              </a>
            </div>

            <!-- File Management Section -->
            <div class="nav-section">
              <div class="nav-section-header">File Management</div>
              
              <a routerLink="/file/society" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>business</mat-icon>
                <span>Society</span>
              </a>

              <div class="nav-group">
                <div class="nav-group-header">Security</div>
                <a routerLink="/file/security/new-user" 
                   routerLinkActive="active" 
                   class="nav-item nav-item-sub"
                   (click)="closeMobileNav()">
                  <mat-icon>person_add</mat-icon>
                  <span>New User</span>
                </a>
                <a routerLink="/file/security/authority" 
                   routerLinkActive="active" 
                   class="nav-item nav-item-sub"
                   (click)="closeMobileNav()">
                  <mat-icon>security</mat-icon>
                  <span>Authority</span>
                </a>
                <a routerLink="/file/security/my-rights" 
                   routerLinkActive="active" 
                   class="nav-item nav-item-sub"
                   (click)="closeMobileNav()">
                  <mat-icon>verified_user</mat-icon>
                  <span>My Rights</span>
                </a>
                <a routerLink="/file/security/change-password" 
                   routerLinkActive="active" 
                   class="nav-item nav-item-sub"
                   (click)="closeMobileNav()">
                  <mat-icon>lock</mat-icon>
                  <span>Change Password</span>
                </a>
              </div>

              <a routerLink="/file/create-new-year" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>event</mat-icon>
                <span>Create New Year</span>
              </a>
            </div>

            <!-- Master Data Section -->
            <div class="nav-section">
              <div class="nav-section-header">Master Data</div>
              
              <a routerLink="/master/member-details" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>people</mat-icon>
                <span>Member Details</span>
              </a>

              <a routerLink="/master/deposit-scheme" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>savings</mat-icon>
                <span>Deposit Scheme</span>
              </a>

              <a routerLink="/master/interest-master" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>percent</mat-icon>
                <span>Interest Master</span>
              </a>

              <a routerLink="/master/table" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>table_view</mat-icon>
                <span>Table Master</span>
              </a>
            </div>

            <!-- Transactions Section -->
            <div class="nav-section">
              <div class="nav-section-header">Transactions</div>
              
              <a routerLink="/transaction/deposit-receipt" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>receipt</mat-icon>
                <span>Deposit Receipt</span>
              </a>

              <a routerLink="/transaction/deposit-payment" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>payment</mat-icon>
                <span>Deposit Payment</span>
              </a>
              
              <a routerLink="/transaction/monthly-demand" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>payment</mat-icon>
                <span>Demand</span>
              </a>

              <a routerLink="/transaction/loan-taken" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>account_balance_wallet</mat-icon>
                <span>Loan Taken</span>
              </a>

              <a routerLink="/transaction/deposit-slip" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>description</mat-icon>
                <span>Deposit Slip</span>
              </a>
            </div>

            <!-- Accounts Section -->
            <div class="nav-section">
              <div class="nav-section-header">Accounts</div>
              
              <a routerLink="/accounts/voucher-creation" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>note</mat-icon>
                <span>Voucher</span>
              </a>
              
              <a routerLink="/accounts/loan-receipt" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>note</mat-icon>
                <span>Loan Receipt</span>
              </a>

              <a routerLink="/accounts/cash-book" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>book</mat-icon>
                <span>Cash Book</span>
              </a>

              <a routerLink="/accounts/ledger" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>account_book</mat-icon>
                <span>Ledger</span>
              </a>

              <a routerLink="/accounts/trial-balance" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>balance</mat-icon>
                <span>Trial Balance</span>
              </a>

              <a routerLink="/accounts/profit-loss" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>trending_up</mat-icon>
                <span>Profit & Loss</span>
              </a>

              <a routerLink="/accounts/balance-sheet" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>assessment</mat-icon>
                <span>Balance Sheet</span>
              </a>
            </div>

            <!-- Reports Section -->
            <div class="nav-section">
              <div class="nav-section-header">Reports</div>
              
              <a routerLink="/reports/employees" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>group</mat-icon>
                <span>Employee Reports</span>
              </a>

              <a routerLink="/reports/loan" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>money</mat-icon>
                <span>Loan Reports</span>
              </a>

              <a routerLink="/reports/opening-balance" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>start</mat-icon>
                <span>Opening Balance</span>
              </a>

              <a routerLink="/reports/closing-balance" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>stop</mat-icon>
                <span>Closing Balance</span>
              </a>
            </div>

            <!-- System Section -->
            <div class="nav-section">
              <div class="nav-section-header">System</div>
              
              <a routerLink="/backup" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>backup</mat-icon>
                <span>Backup</span>
              </a>

              <a routerLink="/admin" 
                 routerLinkActive="active" 
                 class="nav-item"
                 (click)="closeMobileNav()">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>Administration</span>
              </a>
            </div>
          </nav>
        </mat-sidenav>

        <!-- Main Content Area -->
        <mat-sidenav-content class="main-content">
          <!-- Professional Header -->
          <mat-toolbar class="header-professional">
            <button mat-icon-button (click)="drawer.toggle()" class="menu-button">
              <mat-icon>menu</mat-icon>
            </button>

            <!-- Breadcrumb -->
            <div class="breadcrumb flex-1">
              <ng-container *ngFor="let breadcrumb of breadcrumbs; let last = last">
                <span [class.active]="last">{{ breadcrumb.label }}</span>
                <mat-icon *ngIf="!last" class="separator text-sm">chevron_right</mat-icon>
              </ng-container>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center space-x-2">
              <!-- Dark Mode Toggle -->
              <button mat-icon-button 
                      (click)="toggleDarkMode()" 
                      matTooltip="Toggle Dark Mode"
                      class="header-action">
                <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
              </button>

              <!-- Notifications -->
              <button mat-icon-button 
                      [matMenuTriggerFor]="notificationMenu"
                      matTooltip="Notifications"
                      class="header-action">
                <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
              </button>

              <!-- User Menu -->
              <button mat-icon-button 
                      [matMenuTriggerFor]="userMenu"
                      matTooltip="User Menu"
                      class="header-action">
                <mat-icon>account_circle</mat-icon>
              </button>
            </div>
          </mat-toolbar>

          <!-- Page Content -->
          <div class="content-professional">
            <div class="content-wrapper">
              <router-outlet></router-outlet>
            </div>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>

    <!-- Notification Menu -->
    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="menu-header">
        <span class="text-section-header font-semibold">Notifications</span>
        <button mat-button color="primary" class="text-xs">Mark all as read</button>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item>
        <mat-icon>info</mat-icon>
        <div class="ml-3">
          <div class="text-body font-medium">New member registered</div>
          <div class="text-caption text-gray-500">2 minutes ago</div>
        </div>
      </button>
      <button mat-menu-item>
        <mat-icon>warning</mat-icon>
        <div class="ml-3">
          <div class="text-body font-medium">Loan payment overdue</div>
          <div class="text-caption text-gray-500">1 hour ago</div>
        </div>
      </button>
      <button mat-menu-item>
        <mat-icon>check_circle</mat-icon>
        <div class="ml-3">
          <div class="text-body font-medium">Backup completed successfully</div>
          <div class="text-caption text-gray-500">3 hours ago</div>
        </div>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item class="text-center">
        <span class="text-primary">View all notifications</span>
      </button>
    </mat-menu>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu" class="user-menu">
      <div class="menu-header">
        <div class="flex items-center space-x-3 p-2">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ currentUser?.name?.charAt(0) || 'U' }}
          </div>
          <div>
            <div class="text-body font-semibold">{{ currentUser?.name || 'User' }}</div>
            <div class="text-caption text-gray-500">{{ currentUser?.email || 'user@example.com' }}</div>
          </div>
        </div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>My Profile</span>
      </button>
      <button mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Sign Out</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
      background: var(--color-bg-secondary);
    }

    .sidebar-professional {
      width: 280px;
      border-right: 1px solid var(--color-border);
      background: var(--gradient-sidebar);
    }

    .sidebar-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: var(--spacing-md);
    }

    .sidebar-nav {
      padding: var(--spacing-md);
    }

    .nav-section {
      margin-bottom: var(--spacing-lg);
    }

    .nav-section-header {
      padding: var(--spacing-sm) var(--spacing-md);
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-sm);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: 12px var(--spacing-md);
      margin: 2px 0;
      border-radius: var(--radius-md);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 14px;
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-weight: 600;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: white;
      border-radius: 0 2px 2px 0;
    }

    .nav-group {
      margin-left: var(--spacing-md);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      padding-left: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    .nav-group-header {
      padding: var(--spacing-xs) var(--spacing-sm);
      color: rgba(255, 255, 255, 0.5);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-xs);
    }

    .nav-item-sub {
      font-size: 13px;
      padding: 8px var(--spacing-sm);
      margin: 1px 0;
    }

    .header-professional {
      background: var(--color-bg-card);
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-border);
      height: 64px;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .menu-button {
      margin-right: var(--spacing-md);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 14px;
      color: var(--color-text-secondary);
    }

    .breadcrumb .separator {
      color: var(--color-text-muted);
    }

    .breadcrumb .active {
      color: var(--color-text-primary);
      font-weight: 500;
    }

    .header-action {
      width: 40px;
      height: 40px;
      transition: all 0.2s ease;
    }

    .header-action:hover {
      background: var(--color-bg-secondary);
      transform: scale(1.05);
    }

    .content-professional {
      background: var(--color-bg-secondary);
      min-height: calc(100vh - 64px);
      padding: var(--spacing-lg);
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }

    .menu-header {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border-light);
      display: flex;
      align-items: center;
      justify-content: between;
      background: var(--color-bg-secondary);
    }

    .notification-menu,
    .user-menu {
      min-width: 280px;
      max-width: 320px;
    }

    .notification-menu .mat-mdc-menu-item,
    .user-menu .mat-mdc-menu-item {
      height: auto;
      min-height: 48px;
      padding: var(--spacing-sm) var(--spacing-md);
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .sidebar-professional {
        width: 100vw;
        max-width: 280px;
      }

      .content-professional {
        padding: var(--spacing-md);
      }

      .breadcrumb {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .content-professional {
        padding: var(--spacing-sm);
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  isMobile = false;
  isDarkMode = false;
  currentUser: any = null;
  breadcrumbs: { label: string; route?: string }[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Check if mobile
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    // Load dark mode preference
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.updateDarkMode();

    // Get current user
    this.currentUser = this.authService.getCurrentUser();

    // Listen to route changes for breadcrumbs
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateBreadcrumbs(event.url);
      });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.updateDarkMode();
  }

  private updateDarkMode() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  private updateBreadcrumbs(url: string) {
    const segments = url.split('/').filter(segment => segment);
    this.breadcrumbs = [{ label: 'Dashboard', route: '/dashboard' }];

    let currentRoute = '';
    segments.forEach((segment, index) => {
      currentRoute += `/${segment}`;
      const label = this.formatBreadcrumbLabel(segment);
      this.breadcrumbs.push({ label, route: index === segments.length - 1 ? undefined : currentRoute });
    });
  }

  private formatBreadcrumbLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  closeMobileNav() {
    if (this.isMobile) {
      this.drawer.close();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
