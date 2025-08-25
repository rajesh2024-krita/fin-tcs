
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService, UserRole } from '../../../../services/auth.service';

interface MenuPermission {
  module: string;
  menuName: string;
  category: string;
  view: boolean;
  edit: boolean;
  create: boolean;
  delete: boolean;
}

interface RolePermissions {
  role: UserRole;
  roleName: string;
  permissions: MenuPermission[];
}

@Component({
  selector: 'app-authority',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatTableModule, 
    MatCheckboxModule, 
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule
  ],
  template: `
    <div class="authority-container">
      <mat-card class="header-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>security</mat-icon>
            Authority Management
          </mat-card-title>
          <mat-card-subtitle>Manage permissions for different user roles</mat-card-subtitle>
        </mat-card-header>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="saveAllPermissions()">
            <mat-icon>save</mat-icon>
            Save All Changes
          </button>
          <button mat-button (click)="resetToDefault()">
            <mat-icon>refresh</mat-icon>
            Reset to Default
          </button>
        </mat-card-actions>
      </mat-card>

      <mat-tab-group class="role-tabs">
        <mat-tab *ngFor="let rolePermission of rolePermissions" [label]="rolePermission.roleName">
          <div class="tab-content">
            <div class="role-actions">
              <button mat-button color="primary" (click)="selectAllForRole(rolePermission)">
                <mat-icon>select_all</mat-icon>
                Select All
              </button>
              <button mat-button color="warn" (click)="deselectAllForRole(rolePermission)">
                <mat-icon>deselect</mat-icon>
                Deselect All
              </button>
              <button mat-raised-button color="accent" (click)="saveRolePermissions(rolePermission)">
                <mat-icon>save</mat-icon>
                Save {{ rolePermission.roleName }}
              </button>
            </div>

            <mat-accordion>
              <mat-expansion-panel *ngFor="let category of getCategories()" [expanded]="true">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon>{{ getCategoryIcon(category) }}</mat-icon>
                    {{ category }}
                  </mat-panel-title>
                  <mat-panel-description>
                    {{ getCategoryPermissions(rolePermission, category).length }} menus
                  </mat-panel-description>
                </mat-expansion-panel-header>

                <div class="permissions-table">
                  <table mat-table [dataSource]="getCategoryPermissions(rolePermission, category)" class="permissions-mat-table">
                    <!-- Menu Name Column -->
                    <ng-container matColumnDef="menuName">
                      <th mat-header-cell *matHeaderCellDef>Menu</th>
                      <td mat-cell *matCellDef="let permission" class="menu-name">
                        <mat-icon>{{ getMenuIcon(permission.module) }}</mat-icon>
                        {{ permission.menuName }}
                      </td>
                    </ng-container>

                    <!-- View Permission Column -->
                    <ng-container matColumnDef="view">
                      <th mat-header-cell *matHeaderCellDef class="permission-header">
                        <mat-icon>visibility</mat-icon>
                        View
                      </th>
                      <td mat-cell *matCellDef="let permission" class="permission-cell">
                        <mat-checkbox 
                          [(ngModel)]="permission.view"
                          (change)="onPermissionChange(rolePermission, permission)"
                          color="primary">
                        </mat-checkbox>
                      </td>
                    </ng-container>

                    <!-- Edit Permission Column -->
                    <ng-container matColumnDef="edit">
                      <th mat-header-cell *matHeaderCellDef class="permission-header">
                        <mat-icon>edit</mat-icon>
                        Edit
                      </th>
                      <td mat-cell *matCellDef="let permission" class="permission-cell">
                        <mat-checkbox 
                          [(ngModel)]="permission.edit"
                          (change)="onPermissionChange(rolePermission, permission)"
                          color="accent">
                        </mat-checkbox>
                      </td>
                    </ng-container>

                    <!-- Create Permission Column -->
                    <ng-container matColumnDef="create">
                      <th mat-header-cell *matHeaderCellDef class="permission-header">
                        <mat-icon>add</mat-icon>
                        Create
                      </th>
                      <td mat-cell *matCellDef="let permission" class="permission-cell">
                        <mat-checkbox 
                          [(ngModel)]="permission.create"
                          (change)="onPermissionChange(rolePermission, permission)"
                          color="primary">
                        </mat-checkbox>
                      </td>
                    </ng-container>

                    <!-- Delete Permission Column -->
                    <ng-container matColumnDef="delete">
                      <th mat-header-cell *matHeaderCellDef class="permission-header">
                        <mat-icon>delete</mat-icon>
                        Delete
                      </th>
                      <td mat-cell *matCellDef="let permission" class="permission-cell">
                        <mat-checkbox 
                          [(ngModel)]="permission.delete"
                          (change)="onPermissionChange(rolePermission, permission)"
                          color="warn">
                        </mat-checkbox>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .authority-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-card {
      margin-bottom: 24px;
    }

    .header-card mat-card-header {
      display: flex;
      align-items: center;
    }

    .header-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .role-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
      padding: 24px;
    }

    .role-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .permissions-table {
      margin-top: 16px;
    }

    .permissions-mat-table {
      width: 100%;
      background: #fafafa;
      border-radius: 8px;
    }

    .menu-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      min-width: 200px;
    }

    .permission-header {
      text-align: center;
      font-weight: 600;
      width: 100px;
    }

    .permission-header mat-icon {
      vertical-align: middle;
      margin-right: 4px;
    }

    .permission-cell {
      text-align: center;
      padding: 8px;
    }

    mat-expansion-panel {
      margin-bottom: 16px;
      border-radius: 8px !important;
    }

    mat-expansion-panel-header {
      background: #f5f5f5;
    }

    mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .authority-container {
        padding: 12px;
      }
      
      .role-actions {
        flex-direction: column;
      }
      
      .role-actions button {
        width: 100%;
      }
      
      .permissions-mat-table {
        font-size: 12px;
      }
      
      .menu-name {
        min-width: 150px;
      }
      
      .permission-header {
        width: 80px;
      }
    }

    @media (max-width: 480px) {
      .header-card mat-card-title {
        font-size: 18px;
      }
      
      .tab-content {
        padding: 12px;
      }
      
      .permissions-mat-table {
        font-size: 11px;
      }
    }
  `]
})
export class AuthorityComponent implements OnInit {
  displayedColumns: string[] = ['menuName', 'view', 'edit', 'create', 'delete'];
  rolePermissions: RolePermissions[] = [];
  hasChanges = false;

  private allMenus: Omit<MenuPermission, 'view' | 'edit' | 'create' | 'delete'>[] = [
    // File Menu
    { module: 'society', menuName: 'Society', category: 'File' },
    { module: 'authority', menuName: 'Authority', category: 'File - Security' },
    { module: 'my-rights', menuName: 'My Rights', category: 'File - Security' },
    { module: 'new-user', menuName: 'New User', category: 'File - Security' },
    { module: 'retrieve-password', menuName: 'Retrieve Password', category: 'File - Security' },
    { module: 'change-password', menuName: 'Change Password', category: 'File - Security' },
    { module: 'admin-handover', menuName: 'Admin Handover', category: 'File - Security' },
    { module: 'create-new-year', menuName: 'Create New Year', category: 'File' },
    { module: 'edit-opening-balance', menuName: 'Edit Opening Balance', category: 'File' },

    // Master Menu
    { module: 'member-details', menuName: 'Member Details', category: 'Master' },
    { module: 'table', menuName: 'Table', category: 'Master' },
    { module: 'deposit-scheme', menuName: 'Deposit Scheme', category: 'Master' },
    { module: 'interest-master', menuName: 'Interest Master', category: 'Master' },

    // Transaction Menu
    { module: 'deposit-receipt', menuName: 'Deposit Receipt', category: 'Transaction' },
    { module: 'deposit-payment', menuName: 'Deposit Payment', category: 'Transaction' },
    { module: 'deposit-slip', menuName: 'Deposit Slip', category: 'Transaction' },
    { module: 'deposit-renew', menuName: 'Deposit Renew', category: 'Transaction' },
    { module: 'account-closure', menuName: 'Account Closure', category: 'Transaction' },
    { module: 'loan-taken', menuName: 'Loan Taken', category: 'Transaction' },
    { module: 'demand-process', menuName: 'Demand Process', category: 'Transaction' },

    // Accounts Menu
    { module: 'cash-book', menuName: 'Cash Book', category: 'Accounts' },
    { module: 'day-book', menuName: 'Day Book', category: 'Accounts' },
    { module: 'ledger', menuName: 'Ledger', category: 'Accounts' },
    { module: 'group', menuName: 'Group', category: 'Accounts' },
    { module: 'trial-balance', menuName: 'Trial Balance', category: 'Accounts' },
    { module: 'balance-sheet', menuName: 'Balance Sheet', category: 'Accounts' },
    { module: 'profit-loss', menuName: 'Profit & Loss', category: 'Accounts' },
    { module: 'receipt-payment', menuName: 'Receipt & Payment', category: 'Accounts' },
    { module: 'voucher', menuName: 'Voucher', category: 'Accounts' },
    { module: 'loan-receipt', menuName: 'Loan Receipt', category: 'Accounts' },

    // Reports Menu
    { module: 'opening-balance', menuName: 'Opening Balance', category: 'Reports' },
    { module: 'closing-balance', menuName: 'Closing Balance', category: 'Reports' },
    { module: 'employees', menuName: 'Employees', category: 'Reports' },
    { module: 'loan', menuName: 'Loan', category: 'Reports' },
    { module: 'voucher-report', menuName: 'Voucher Report', category: 'Reports' },

    // Other
    { module: 'statement', menuName: 'Statement', category: 'Other' },
    { module: 'backup', menuName: 'Backup', category: 'System' },
    { module: 'user-management', menuName: 'User Management', category: 'System' }
  ];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeRolePermissions();
  }

  initializeRolePermissions() {
    const roles = [
      { role: UserRole.SOCIETY_ADMIN, roleName: 'Society Admin' },
      { role: UserRole.ACCOUNTANT, roleName: 'Accountant' },
      { role: UserRole.MEMBER, roleName: 'Member' }
    ];

    this.rolePermissions = roles.map(roleInfo => ({
      role: roleInfo.role,
      roleName: roleInfo.roleName,
      permissions: this.allMenus.map(menu => ({
        ...menu,
        ...this.getDefaultPermissions(roleInfo.role, menu.module)
      }))
    }));
  }

  getDefaultPermissions(role: UserRole, module: string): Pick<MenuPermission, 'view' | 'edit' | 'create' | 'delete'> {
    switch (role) {
      case UserRole.SOCIETY_ADMIN:
        return { view: true, edit: true, create: true, delete: true };
      case UserRole.ACCOUNTANT:
        if (['member-details', 'user-management', 'authority', 'admin-handover'].includes(module)) {
          return { view: false, edit: false, create: false, delete: false };
        }
        return { view: true, edit: true, create: true, delete: false };
      case UserRole.MEMBER:
        if (['cash-book', 'statement'].includes(module)) {
          return { view: true, edit: false, create: false, delete: false };
        }
        return { view: false, edit: false, create: false, delete: false };
      default:
        return { view: false, edit: false, create: false, delete: false };
    }
  }

  getCategories(): string[] {
    const categories = new Set(this.allMenus.map(menu => menu.category));
    return Array.from(categories).sort();
  }

  getCategoryPermissions(rolePermission: RolePermissions, category: string): MenuPermission[] {
    return rolePermission.permissions.filter(p => p.category === category);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'File': 'folder',
      'File - Security': 'security',
      'Master': 'storage',
      'Transaction': 'swap_horiz',
      'Accounts': 'account_balance',
      'Reports': 'assessment',
      'Other': 'more_horiz',
      'System': 'settings'
    };
    return icons[category] || 'menu';
  }

  getMenuIcon(module: string): string {
    const icons: { [key: string]: string } = {
      'society': 'business',
      'authority': 'admin_panel_settings',
      'my-rights': 'verified_user',
      'new-user': 'person_add',
      'member-details': 'people',
      'deposit-receipt': 'receipt',
      'cash-book': 'account_balance_wallet',
      'backup': 'backup',
      'user-management': 'manage_accounts'
    };
    return icons[module] || 'description';
  }

  onPermissionChange(rolePermission: RolePermissions, permission: MenuPermission) {
    this.hasChanges = true;
  }

  selectAllForRole(rolePermission: RolePermissions) {
    rolePermission.permissions.forEach(permission => {
      permission.view = true;
      permission.edit = true;
      permission.create = true;
      permission.delete = true;
    });
    this.hasChanges = true;
  }

  deselectAllForRole(rolePermission: RolePermissions) {
    rolePermission.permissions.forEach(permission => {
      permission.view = false;
      permission.edit = false;
      permission.create = false;
      permission.delete = false;
    });
    this.hasChanges = true;
  }

  saveRolePermissions(rolePermission: RolePermissions) {
    // Here you would typically save to a backend service
    console.log(`Saving permissions for ${rolePermission.roleName}:`, rolePermission.permissions);
    
    this.snackBar.open(
      `Permissions saved for ${rolePermission.roleName}`,
      'Close',
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  saveAllPermissions() {
    // Here you would typically save all role permissions to a backend service
    console.log('Saving all permissions:', this.rolePermissions);
    
    this.snackBar.open(
      'All permissions saved successfully',
      'Close',
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
    
    this.hasChanges = false;
  }

  resetToDefault() {
    this.initializeRolePermissions();
    this.hasChanges = false;
    
    this.snackBar.open(
      'Permissions reset to default values',
      'Close',
      { duration: 3000, panelClass: ['info-snackbar'] }
    );
  }
}
