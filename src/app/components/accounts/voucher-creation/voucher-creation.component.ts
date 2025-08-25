
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface VoucherEntry {
  particulars: string;
  debit: number;
  credit: number;
  particularCode?: string;
}

@Component({
  selector: 'app-voucher-creation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Voucher Creation</h1>
          <p class="text-gray-600">Create and manage accounting vouchers</p>
        </div>

        <!-- Main Form Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form [formGroup]="voucherForm" class="p-8">
            
            <!-- Top Section -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Voucher Type</label>
                <select formControlName="voucherType" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <option value="">Select Type</option>
                  <option value="Payment">Payment Voucher</option>
                  <option value="Receipt">Receipt Voucher</option>
                  <option value="Journal">Journal Voucher</option>
                  <option value="Contra">Contra Voucher</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">No.</label>
                <input type="text" formControlName="voucherNo" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input type="date" formControlName="voucherDate" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <!-- Voucher Table -->
            <div class="mb-8">
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Voucher Entries</h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <thead class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th class="px-6 py-4 text-left text-sm font-semibold">Particulars</th>
                        <th class="px-6 py-4 text-right text-sm font-semibold">Debit</th>
                        <th class="px-6 py-4 text-right text-sm font-semibold">Credit</th>
                        <th class="px-6 py-4 text-center text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr *ngFor="let entry of voucherEntries; let i = index" 
                          class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-6 py-4 text-sm text-gray-900">{{entry.particulars}}</td>
                        <td class="px-6 py-4 text-sm text-gray-900 text-right">
                          {{entry.debit > 0 ? (entry.debit | number:'1.2-2') : '-'}}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 text-right">
                          {{entry.credit > 0 ? (entry.credit | number:'1.2-2') : '-'}}
                        </td>
                        <td class="px-6 py-4 text-center">
                          <button type="button" (click)="removeEntry(i)" 
                                  class="text-red-600 hover:text-red-800 font-medium text-sm">
                            Remove
                          </button>
                        </td>
                      </tr>
                      <tr *ngIf="voucherEntries.length === 0">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500 text-sm">
                          No entries added yet. Use the form below to add entries.
                        </td>
                      </tr>
                      <!-- Total Row -->
                      <tr *ngIf="voucherEntries.length > 0" class="bg-gradient-to-r from-gray-100 to-gray-200 font-semibold">
                        <td class="px-6 py-4 text-sm text-gray-900 font-bold">Total</td>
                        <td class="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                          ₹{{getTotalDebit() | number:'1.2-2'}}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                          ₹{{getTotalCredit() | number:'1.2-2'}}
                        </td>
                        <td class="px-6 py-4"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Entry Section -->
            <div class="mb-8">
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Add New Entry</h3>
                <div [formGroup]="entryForm" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Db/Cr</label>
                    <select formControlName="type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white">
                      <option value="">Select</option>
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Particulars</label>
                    <input type="text" formControlName="particulars" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                           placeholder="Enter particulars">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                    <input type="number" formControlName="amount" step="0.01"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                           placeholder="0.00">
                  </div>
                  <div class="flex items-end gap-2">
                    <button type="button" (click)="addEntry()" 
                            class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium">
                      Add
                    </button>
                    <button type="button" (click)="clearEntry()" 
                            class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Section -->
            <div class="mb-8">
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Ch No.</label>
                    <input type="text" formControlName="chequeNo" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                           placeholder="Cheque Number">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input type="date" formControlName="chequeDate" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Pass Date</label>
                    <input type="date" formControlName="passDate" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Narration</label>
                    <textarea formControlName="narration" rows="4"
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Enter narration..."></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                    <textarea formControlName="remarks" rows="4"
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Enter remarks..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Balance Check Warning -->
            <div *ngIf="!isBalanced()" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-red-700 font-medium">Warning: Debit and Credit totals don't match! 
                  Difference: ₹{{Math.abs(getTotalDebit() - getTotalCredit()) | number:'1.2-2'}}</span>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex flex-wrap gap-4 justify-center pt-6 border-t border-gray-200">
              <button type="button" (click)="reverseVoucher()" 
                      class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Reverse
              </button>
              <button type="button" (click)="saveVoucher()" [disabled]="!isBalanced()" 
                      class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Save
              </button>
              <button type="button" (click)="printVoucher()" 
                      class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Print
              </button>
              <button type="button" (click)="deleteVoucher()" 
                      class="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Delete
              </button>
              <button type="button" (click)="newVoucher()" 
                      class="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                New
              </button>
              <button type="button" (click)="closeForm()" 
                      class="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
    }
    
    @media (max-width: 768px) {
      .grid-cols-3 {
        grid-template-columns: 1fr;
      }
      .grid-cols-4 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class VoucherCreationComponent implements OnInit {
  voucherForm: FormGroup;
  entryForm: FormGroup;
  voucherEntries: VoucherEntry[] = [];
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.voucherForm = this.createVoucherForm();
    this.entryForm = this.createEntryForm();
  }

  ngOnInit() {
    // Set default date to current date
    const today = new Date().toISOString().split('T')[0];
    this.voucherForm.patchValue({
      voucherDate: today,
      chequeDate: today,
      passDate: today
    });
  }

  createVoucherForm(): FormGroup {
    return this.fb.group({
      voucherType: ['', Validators.required],
      voucherNo: ['', Validators.required],
      voucherDate: ['', Validators.required],
      chequeNo: [''],
      chequeDate: [''],
      passDate: [''],
      narration: [''],
      remarks: ['']
    });
  }

  createEntryForm(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      particulars: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  addEntry() {
    if (this.entryForm.valid) {
      const formValue = this.entryForm.value;
      const entry: VoucherEntry = {
        particulars: formValue.particulars,
        debit: formValue.type === 'debit' ? parseFloat(formValue.amount) : 0,
        credit: formValue.type === 'credit' ? parseFloat(formValue.amount) : 0
      };

      this.voucherEntries.push(entry);
      this.clearEntry();
      this.snackBar.open('Entry added successfully!', 'Close', { duration: 2000 });
    } else {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
    }
  }

  removeEntry(index: number) {
    this.voucherEntries.splice(index, 1);
    this.snackBar.open('Entry removed', 'Close', { duration: 2000 });
  }

  clearEntry() {
    this.entryForm.reset();
  }

  getTotalDebit(): number {
    return this.voucherEntries.reduce((sum, entry) => sum + entry.debit, 0);
  }

  getTotalCredit(): number {
    return this.voucherEntries.reduce((sum, entry) => sum + entry.credit, 0);
  }

  isBalanced(): boolean {
    return this.getTotalDebit() === this.getTotalCredit() && this.voucherEntries.length > 0;
  }

  reverseVoucher() {
    this.voucherEntries.forEach(entry => {
      const temp = entry.debit;
      entry.debit = entry.credit;
      entry.credit = temp;
    });
    this.snackBar.open('Voucher entries reversed!', 'Close', { duration: 2000 });
  }

  saveVoucher() {
    if (this.voucherForm.valid && this.isBalanced()) {
      const voucherData = {
        ...this.voucherForm.value,
        entries: this.voucherEntries,
        totalDebit: this.getTotalDebit(),
        totalCredit: this.getTotalCredit()
      };
      console.log('Saving voucher:', voucherData);
      this.snackBar.open('Voucher saved successfully!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Please complete the form and ensure entries are balanced', 'Close', { duration: 3000 });
    }
  }

  printVoucher() {
    window.print();
    this.snackBar.open('Print dialog opened', 'Close', { duration: 2000 });
  }

  deleteVoucher() {
    if (confirm('Are you sure you want to delete this voucher?')) {
      this.newVoucher();
      this.snackBar.open('Voucher deleted', 'Close', { duration: 2000 });
    }
  }

  newVoucher() {
    this.voucherForm.reset();
    this.entryForm.reset();
    this.voucherEntries = [];
    const today = new Date().toISOString().split('T')[0];
    this.voucherForm.patchValue({
      voucherDate: today,
      chequeDate: today,
      passDate: today
    });
    this.snackBar.open('New voucher form ready', 'Close', { duration: 2000 });
  }

  closeForm() {
    if (confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
      // Implement navigation logic here
      this.snackBar.open('Form closed', 'Close', { duration: 2000 });
    }
  }
}
