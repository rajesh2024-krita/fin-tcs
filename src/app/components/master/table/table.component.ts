
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3 mb-4">
          <div class="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <mat-icon class="text-primary-600 dark:text-primary-400">table_chart</mat-icon>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Table Management</h1>
            <p class="text-gray-600 dark:text-gray-400">Data table configuration and management</p>
          </div>
        </div>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="text-center py-12">
            <mat-icon class="text-6xl text-gray-400 dark:text-gray-500 mb-4">table_view</mat-icon>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Table Configuration</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Data table configuration and management tools will be available here.</p>
            <button class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
              <mat-icon class="mr-2">add</mat-icon>
              Create Table
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
export class TableComponent {}
