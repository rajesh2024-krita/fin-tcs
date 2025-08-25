
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MemberService, Member } from '../../../services/member.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  dataSource = new MatTableDataSource<Member>([]);
  displayedColumns: string[] = ['memberNo', 'name', 'mobile', 'status', 'actions'];
  
  // Signals for component state
  private offCanvasOpen = signal(false);
  private editMode = signal(false);
  private currentMember = signal<Member | null>(null);
  private submitting = signal(false);
  
  searchTerm: string = '';
  allMembers: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = this.createMemberForm();
  }

  ngOnInit() {
    this.loadMembers();
  }

  // Signal getters
  isOffCanvasOpen = () => this.offCanvasOpen();
  isEditMode = () => this.editMode();
  isSubmitting = () => this.submitting();

  private createMemberForm(): FormGroup {
    return this.fb.group({
      memberNo: ['', Validators.required],
      name: ['', Validators.required],
      fhName: ['', Validators.required],
      dateOfBirth: [''],
      mobile: [''],
      email: ['', Validators.email],
      designation: [''],
      dojJob: [''],
      doRetirement: [''],
      branch: [''],
      dojSociety: [''],
      officeAddress: [''],
      residenceAddress: [''],
      city: [''],
      phoneOffice: [''],
      phoneResidence: [''],
      nominee: [''],
      nomineeRelation: [''],
      shareAmount: [0, [Validators.min(0)]],
      cdAmount: [0, [Validators.min(0)]],
      bankName: [''],
      payableAt: [''],
      accountNo: [''],
      status: ['Active'],
      shareDeduction: [0],
      withdrawal: [0],
      gLoanInstalment: [0],
      eLoanInstalment: [0]
    });
  }

  loadMembers() {
    this.memberService.getAllMembers().subscribe({
      next: (members) => {
        this.allMembers = members;
        this.dataSource.data = members;
        console.log('Members loaded:', members);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.showSnackBar('Error loading members');
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.dataSource.data = this.allMembers;
      return;
    }

    const filtered = this.allMembers.filter(member =>
      member.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      member.memberNo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      member.mobile?.includes(this.searchTerm)
    );
    
    this.dataSource.data = filtered;
  }

  openOffCanvas(mode: 'create' | 'edit', member?: Member) {
    this.editMode.set(mode === 'edit');
    
    if (mode === 'edit' && member) {
      this.currentMember.set(member);
      this.populateForm(member);
    } else {
      this.currentMember.set(null);
      this.memberForm.reset();
      this.memberForm.patchValue({
        shareAmount: 0,
        cdAmount: 0,
        status: 'Active'
      });
    }
    
    this.offCanvasOpen.set(true);
  }

  closeOffCanvas() {
    this.offCanvasOpen.set(false);
    this.memberForm.reset();
    this.editMode.set(false);
    this.currentMember.set(null);
  }

  populateForm(member: Member) {
    this.memberForm.patchValue({
      memberNo: member.memberNo,
      name: member.name,
      fhName: member.fhName,
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
      mobile: member.mobile,
      email: member.email,
      designation: member.designation,
      dojJob: member.dojJob ? new Date(member.dojJob) : null,
      doRetirement: member.doRetirement ? new Date(member.doRetirement) : null,
      branch: member.branch,
      dojSociety: member.dojSociety ? new Date(member.dojSociety) : null,
      officeAddress: member.officeAddress,
      residenceAddress: member.residenceAddress,
      city: member.city,
      phoneOffice: member.phoneOffice,
      phoneResidence: member.phoneResidence,
      nominee: member.nominee,
      nomineeRelation: member.nomineeRelation,
      shareAmount: member.shareAmount,
      cdAmount: member.cdAmount,
      bankName: member.bankName,
      payableAt: member.payableAt,
      accountNo: member.accountNo,
      status: member.status,
      shareDeduction: member.shareDeduction,
      withdrawal: member.withdrawal,
      gLoanInstalment: member.gLoanInstalment,
      eLoanInstalment: member.eLoanInstalment
    });
  }

  onSubmit() {
    if (this.memberForm.valid) {
      this.submitting.set(true);
      const formData = { ...this.memberForm.value };

      if (this.isEditMode()) {
        const currentMember = this.currentMember();
        if (currentMember) {
          this.memberService.updateMember(currentMember.id!, formData).subscribe({
            next: () => {
              this.showSnackBar('Member updated successfully');
              this.loadMembers();
              this.closeOffCanvas();
            },
            error: (error) => {
              console.error('Error updating member:', error);
              this.showSnackBar('Error updating member');
            },
            complete: () => this.submitting.set(false)
          });
        }
      } else {
        this.memberService.createMember(formData).subscribe({
          next: () => {
            this.showSnackBar('Member created successfully');
            this.loadMembers();
            this.closeOffCanvas();
          },
          error: (error) => {
            console.error('Error creating member:', error);
            this.showSnackBar('Error creating member');
          },
          complete: () => this.submitting.set(false)
        });
      }
    }
  }

  onView(member: Member) {
    console.log('Viewing member:', member);
    // Implement view logic - could open a read-only modal
  }

  onEdit(member: Member) {
    this.openOffCanvas('edit', member);
  }

  onDelete(member: Member) {
    if (confirm(`Are you sure you want to delete member ${member.name}?`)) {
      this.memberService.deleteMember(member.id!).subscribe({
        next: () => {
          this.showSnackBar('Member deleted successfully');
          this.loadMembers();
        },
        error: (error) => {
          console.error('Error deleting member:', error);
          this.showSnackBar('Error deleting member');
        }
      });
    }
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
