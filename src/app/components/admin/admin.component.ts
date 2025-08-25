
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule],
  template: `
    <div class="admin-container">
      <h1>Administration</h1>
      
      <mat-tab-group>
        <mat-tab label="User Management">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Manage Users</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Total Users: 15</p>
                <p>Active Users: 12</p>
                <p>Administrators: 3</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary">
                  <mat-icon>person_add</mat-icon>
                  Add User
                </button>
                <button mat-button>View All Users</button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
        
        <mat-tab label="System Settings">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>System Configuration</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Interest Rate: 8.5% per annum</p>
                <p>Late Fee: ₹500</p>
                <p>Minimum Deposit: ₹1,000</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="accent">Update Settings</button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .tab-content {
      padding: 20px;
    }

    mat-card-actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class AdminComponent {}
