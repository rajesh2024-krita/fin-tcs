
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  animations: [
    trigger('fadeInStagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="dashboard-container p-6 space-y-8" [@fadeInStagger]>
      <!-- Welcome Header -->
      <div class="relative overflow-hidden rounded-xl p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div class="absolute inset-0 bg-black/5"></div>
        <div class="relative">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h1 class="text-2xl font-bold">Welcome to FinTCS Dashboard</h1>
              <p class="text-base text-indigo-100">Manage your financial data with elegance and efficiency</p>
            </div>
            <mat-icon class="text-4xl text-white/30">dashboard</mat-icon>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let stat of statistics; let i = index" 
             class="stat-card group relative overflow-hidden rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          
          <!-- Gradient Background -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               [class]="getGradientClass(i)"></div>
          
          <!-- Content -->
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="p-2 rounded-lg" [class]="getIconBackgroundClass(i)">
                <mat-icon class="text-xl" [class]="getIconColorClass(i)">{{stat.icon}}</mat-icon>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold group-hover:text-white transition-colors duration-200" 
                     [class]="getTextColorClass()">
                  {{stat.value}}
                </div>
                <div class="text-xs font-medium group-hover:text-white/80 transition-colors duration-200" 
                     [class]="getSecondaryTextColorClass()">
                  {{stat.change}}
                </div>
              </div>
            </div>
            <h3 class="text-base font-semibold group-hover:text-white transition-colors duration-200" 
                [class]="getTextColorClass()">
              {{stat.title}}
            </h3>
            <p class="text-sm group-hover:text-white/70 transition-colors duration-200" 
               [class]="getSecondaryTextColorClass()">
              {{stat.description}}
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-center mb-6">
          <div class="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 mr-4">
            <mat-icon class="text-white text-2xl">flash_on</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Quick Actions</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button *ngFor="let action of quickActions; let i = index"
                  mat-raised-button
                  class="action-button p-6 py-20 rounded-2xl text-left transition-all duration-300 transform hover:scale-105"
                  [class]="getActionButtonClass(i)">
            <div class="flex items-center space-x-4">
              <mat-icon class="text-2xl">{{action.icon}}</mat-icon>
              <div>
                <div class="font-semibold">{{action.title}}</div>
                <div class="text-sm opacity-80">{{action.description}}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 mr-4">
                <mat-icon class="text-white text-2xl">account_balance_wallet</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
            </div>
            <button mat-button class="text-blue-600 hover:text-blue-700">View All</button>
          </div>
          
          <div class="space-y-4">
            <div *ngFor="let transaction of recentTransactions" 
                 class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <mat-icon class="text-white text-sm">{{transaction.icon}}</mat-icon>
                </div>
                <div>
                  <div class="font-medium text-gray-800 dark:text-white">{{transaction.description}}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{transaction.date}}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold" [class]="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'">
                  {{transaction.amount > 0 ? '+' : ''}}₹{{Math.abs(transaction.amount).toLocaleString()}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center mb-6">
            <div class="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 mr-4">
              <mat-icon class="text-white text-2xl">monitoring</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">System Status</h3>
          </div>
          
          <div class="space-y-6">
            <div *ngFor="let status of systemStatus" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{status.name}}</span>
                <span class="text-sm font-bold" [class]="getStatusColor(status.value)">{{status.value}}%</span>
              </div>
              <mat-progress-bar 
                [value]="status.value" 
                [color]="getStatusColorName(status.value)"
                class="rounded-full overflow-hidden h-2">
              </mat-progress-bar>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      animation: fadeIn 0.8s ease-out;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .stat-card:hover::before {
      opacity: 1;
    }
    .mdc-button{
      padding-top: 2rem !important;
      padding-bottom: 2rem !important;
    }

    .action-button {
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
    }
  `]
})
export class DashboardComponent {
  Math = Math;

  statistics = [
    {
      title: 'Total Members',
      value: '1,234',
      change: '+12% this month',
      icon: 'people',
      description: 'Active members in system'
    },
    {
      title: 'Total Deposits',
      value: '₹45.2M',
      change: '+8.5% this month',
      icon: 'account_balance',
      description: 'Total deposits amount'
    },
    {
      title: 'Active Loans',
      value: '156',
      change: '+2.3% this month',
      icon: 'money',
      description: 'Currently active loans'
    },
    {
      title: 'Interest Earned',
      value: '₹2.1M',
      change: '+15.2% this month',
      icon: 'trending_up',
      description: 'Total interest earned'
    }
  ];

  quickActions = [
    {
      title: 'New Member',
      description: 'Register new member',
      icon: 'person_add'
    },
    {
      title: 'New Deposit',
      description: 'Create deposit receipt',
      icon: 'add_circle'
    },
    {
      title: 'Process Loan',
      description: 'Process loan application',
      icon: 'receipt_long'
    },
    {
      title: 'Generate Report',
      description: 'Create financial report',
      icon: 'assessment'
    },
    {
      title: 'Backup Data',
      description: 'Backup system data',
      icon: 'backup'
    },
    {
      title: 'System Settings',
      description: 'Configure system',
      icon: 'settings'
    }
  ];

  recentTransactions = [
    {
      description: 'Member Deposit',
      date: 'Today, 2:30 PM',
      amount: 50000,
      icon: 'add'
    },
    {
      description: 'Loan Disbursement',
      date: 'Today, 11:15 AM',
      amount: -25000,
      icon: 'remove'
    },
    {
      description: 'Interest Credit',
      date: 'Yesterday, 4:45 PM',
      amount: 3500,
      icon: 'trending_up'
    },
    {
      description: 'Withdrawal',
      date: 'Yesterday, 10:20 AM',
      amount: -15000,
      icon: 'remove'
    }
  ];

  systemStatus = [
    { name: 'Database Health', value: 98 },
    { name: 'System Performance', value: 94 },
    { name: 'Security Score', value: 99 },
    { name: 'Backup Status', value: 100 }
  ];

  getGradientClass(index: number): string {
    const gradients = [
      'bg-gradient-to-r from-indigo-500 to-purple-600',
      'bg-gradient-to-r from-green-500 to-emerald-600',
      'bg-gradient-to-r from-orange-500 to-red-600',
      'bg-gradient-to-r from-blue-500 to-cyan-600'
    ];
    return gradients[index % gradients.length];
  }

  getIconBackgroundClass(index: number): string {
    const backgrounds = [
      'bg-indigo-100 dark:bg-indigo-900/30',
      'bg-green-100 dark:bg-green-900/30',
      'bg-orange-100 dark:bg-orange-900/30',
      'bg-blue-100 dark:bg-blue-900/30'
    ];
    return backgrounds[index % backgrounds.length];
  }

  getIconColorClass(index: number): string {
    const colors = [
      'text-indigo-600 dark:text-indigo-400',
      'text-green-600 dark:text-green-400',
      'text-orange-600 dark:text-orange-400',
      'text-blue-600 dark:text-blue-400'
    ];
    return colors[index % colors.length];
  }

  getTextColorClass(): string {
    return 'text-gray-800 dark:text-white';
  }

  getSecondaryTextColorClass(): string {
    return 'text-gray-500 dark:text-gray-400';
  }

  getActionButtonClass(index: number): string {
    const classes = [
      'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700',
      'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700',
      'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700',
      'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700',
      'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700',
      'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
    ];
    return classes[index % classes.length];
  }

  getStatusColor(value: number): string {
    if (value >= 95) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    return 'text-red-600';
  }

  getStatusColorName(value: number): 'primary' | 'accent' | 'warn' {
    if (value >= 95) return 'primary';
    if (value >= 80) return 'accent';
    return 'warn';
  }
}
