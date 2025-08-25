
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="backup-container">
      <h1>Backup Management</h1>
      
      <mat-card class="backup-card">
        <mat-card-header>
          <mat-card-title>Database Backup</mat-card-title>
          <mat-card-subtitle>Create and manage system backups</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <p>Last backup: {{ lastBackupDate | date:'full' }}</p>
          <p>Backup size: 45.2 MB</p>
          <p>Status: All systems operational</p>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="downloadBackup()">
            <mat-icon>download</mat-icon>
            Download Backup
          </button>
          <button mat-raised-button color="accent" (click)="createBackup()">
            <mat-icon>backup</mat-icon>
            Create New Backup
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .backup-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .backup-card {
      margin: 20px 0;
    }

    mat-card-actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class BackupComponent {
  lastBackupDate = new Date();

  downloadBackup() {
    alert('Backup download started...');
  }

  createBackup() {
    alert('Creating new backup...');
  }
}
