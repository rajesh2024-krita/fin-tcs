
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Member {
  id: number;
  memberCode: string;
  name: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
}

export interface DepositScheme {
  id: number;
  schemeName: string;
  schemeCode: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  tenure: number;
  tenureType: string;
  status: string;
}

export interface Loan {
  id: number;
  loanId: string;
  memberCode: string;
  memberName: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  loanDate: string;
  status: string;
  emi: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private membersSubject = new BehaviorSubject<Member[]>([]);
  private schemesSubject = new BehaviorSubject<DepositScheme[]>([]);
  private loansSubject = new BehaviorSubject<Loan[]>([]);

  members$ = this.membersSubject.asObservable();
  schemes$ = this.schemesSubject.asObservable();
  loans$ = this.loansSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Load sample members
    const members: Member[] = [
      {
        id: 1,
        memberCode: 'MEM001',
        name: 'John Doe',
        fatherName: 'Robert Doe',
        address: '123 Main St, City',
        phone: '9876543210',
        email: 'john@example.com',
        joinDate: '2023-01-15',
        status: 'Active'
      },
      {
        id: 2,
        memberCode: 'MEM002',
        name: 'Jane Smith',
        fatherName: 'Michael Smith',
        address: '456 Oak Ave, Town',
        phone: '9876543211',
        email: 'jane@example.com',
        joinDate: '2023-02-20',
        status: 'Active'
      }
    ];

    // Load sample schemes
    const schemes: DepositScheme[] = [
      {
        id: 1,
        schemeCode: 'RD001',
        schemeName: 'Regular Deposit',
        interestRate: 7.5,
        minAmount: 500,
        maxAmount: 50000,
        tenure: 12,
        tenureType: 'months',
        status: 'Active'
      }
    ];

    // Load sample loans
    const loans: Loan[] = [
      {
        id: 1,
        loanId: 'LN001',
        memberCode: 'MEM001',
        memberName: 'John Doe',
        loanAmount: 100000,
        interestRate: 12,
        tenure: 24,
        loanDate: '2024-01-15',
        status: 'Active',
        emi: 4707
      }
    ];

    this.membersSubject.next(members);
    this.schemesSubject.next(schemes);
    this.loansSubject.next(loans);
  }

  // Member methods
  getMembers(): Observable<Member[]> {
    return this.members$;
  }

  addMember(member: Member): void {
    const currentMembers = this.membersSubject.value;
    this.membersSubject.next([...currentMembers, member]);
  }

  updateMember(member: Member): void {
    const currentMembers = this.membersSubject.value;
    const index = currentMembers.findIndex(m => m.id === member.id);
    if (index !== -1) {
      currentMembers[index] = member;
      this.membersSubject.next([...currentMembers]);
    }
  }

  deleteMember(id: number): void {
    const currentMembers = this.membersSubject.value;
    this.membersSubject.next(currentMembers.filter(m => m.id !== id));
  }

  // Scheme methods
  getSchemes(): Observable<DepositScheme[]> {
    return this.schemes$;
  }

  addScheme(scheme: DepositScheme): void {
    const currentSchemes = this.schemesSubject.value;
    this.schemesSubject.next([...currentSchemes, scheme]);
  }

  updateScheme(scheme: DepositScheme): void {
    const currentSchemes = this.schemesSubject.value;
    const index = currentSchemes.findIndex(s => s.id === scheme.id);
    if (index !== -1) {
      currentSchemes[index] = scheme;
      this.schemesSubject.next([...currentSchemes]);
    }
  }

  deleteScheme(id: number): void {
    const currentSchemes = this.schemesSubject.value;
    this.schemesSubject.next(currentSchemes.filter(s => s.id !== id));
  }

  // Loan methods
  getLoans(): Observable<Loan[]> {
    return this.loans$;
  }

  addLoan(loan: Loan): void {
    const currentLoans = this.loansSubject.value;
    this.loansSubject.next([...currentLoans, loan]);
  }

  updateLoan(loan: Loan): void {
    const currentLoans = this.loansSubject.value;
    const index = currentLoans.findIndex(l => l.id === loan.id);
    if (index !== -1) {
      currentLoans[index] = loan;
      this.loansSubject.next([...currentLoans]);
    }
  }

  deleteLoan(id: number): void {
    const currentLoans = this.loansSubject.value;
    this.loansSubject.next(currentLoans.filter(l => l.id !== id));
  }

  // Utility methods
  calculateEMI(principal: number, rate: number, tenure: number): number {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  }

  generateNextId(type: 'member' | 'scheme' | 'loan'): number {
    switch (type) {
      case 'member':
        return Math.max(...this.membersSubject.value.map(m => m.id), 0) + 1;
      case 'scheme':
        return Math.max(...this.schemesSubject.value.map(s => s.id), 0) + 1;
      case 'loan':
        return Math.max(...this.loansSubject.value.map(l => l.id), 0) + 1;
      default:
        return 1;
    }
  }
}
