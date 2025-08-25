
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

interface Member {
  id: number;
  memberNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  society: string;
  joinDate: Date;
  status: string;
  address?: string;
  city?: string;
  state?: string;
}

@Component({
  selector: 'app-member-details-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <button 
            (click)="goBack()"
            class="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <mat-icon class="mr-2">arrow_back</mat-icon>
            Back to Members
          </button>
        </div>

        <!-- Member Profile Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-2xl font-bold text-white">
                  {{member ? getInitials(member.firstName, member.lastName) : ''}}
                </span>
              </div>
              <div class="text-white">
                <h1 class="text-3xl font-bold">{{member?.firstName}} {{member?.lastName}}</h1>
                <p class="text-blue-100">{{member?.memberNo}} • {{member?.role}}</p>
                <div class="mt-2">
                  <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full"
                        [class]="member?.status === 'Active' ? 'bg-green-500 bg-opacity-20 text-green-100' : 'bg-red-500 bg-opacity-20 text-red-100'">
                    {{member?.status}}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs Content -->
          <mat-tab-group class="p-6">
            <!-- Basic Information Tab -->
            <mat-tab label="Basic Information">
              <div class="py-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Member Number</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.memberNo}}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.firstName}} {{member?.lastName}}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.email}}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.phone}}</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Role</label>
                      <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {{member?.role}}
                      </span>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Society</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.society}}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Join Date</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.joinDate | date:'fullDate'}}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                      <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full"
                            [class]="member?.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'">
                        {{member?.status}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Address Information Tab -->
            <mat-tab label="Address Information">
              <div class="py-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.address || 'Not provided'}}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">City</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.city || 'Not provided'}}</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">State</label>
                      <p class="text-lg text-gray-900 dark:text-white">{{member?.state || 'Not provided'}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Activity Tab -->
            <mat-tab label="Recent Activity">
              <div class="py-6">
                <div class="text-center py-12">
                  <mat-icon class="text-6xl text-gray-400 dark:text-gray-500 mb-4">history</mat-icon>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Activity</h3>
                  <p class="text-gray-500 dark:text-gray-400">Member activity will appear here when available.</p>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            (click)="goBack()"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Back to List
          </button>
          <button 
            (click)="editMember()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <mat-icon class="mr-2">edit</mat-icon>
            Edit Member
          </button>
        </div>

        <!-- Member Not Found -->
        <div *ngIf="!member && !loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <mat-icon class="text-6xl text-gray-400 dark:text-gray-500 mb-4">person_off</mat-icon>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Member Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">The member you're looking for doesn't exist or has been removed.</p>
          <button 
            (click)="goBack()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Back to Members
          </button>
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
export class MemberDetailsViewComponent implements OnInit {
  member: Member | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const memberId = this.route.snapshot.paramMap.get('id');
    if (memberId) {
      this.loadMember(parseInt(memberId));
    }
  }

  loadMember(id: number) {
    // In a real application, you would fetch this from a service
    // For now, using sample data
    const sampleMembers: Member[] = [
      {
        id: 1,
        memberNo: 'MEM1001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '9876543210',
        role: 'Member',
        society: 'Main Branch',
        joinDate: new Date('2024-01-15'),
        status: 'Active',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      {
        id: 2,
        memberNo: 'MEM1002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '9876543211',
        role: 'Executive',
        society: 'North Branch',
        joinDate: new Date('2024-02-20'),
        status: 'Active',
        address: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi'
      },
      {
        id: 3,
        memberNo: 'MEM1003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@email.com',
        phone: '9876543212',
        role: 'Board Member',
        society: 'South Branch',
        joinDate: new Date('2023-12-10'),
        status: 'Inactive',
        address: '789 Pine Road',
        city: 'Bangalore',
        state: 'Karnataka'
      }
    ];

    this.member = sampleMembers.find(m => m.id === id) || null;
    this.loading = false;
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  goBack() {
    this.router.navigate(['/master/member-details']);
  }

  editMember() {
    // Navigate back to member list with edit mode
    this.router.navigate(['/master/member-details'], { 
      queryParams: { edit: this.member?.id } 
    });
  }
}
