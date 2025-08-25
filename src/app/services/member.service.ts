
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Member {
  id?: number;
  memberNo: string;
  name: string;
  fhName: string;
  dateOfBirth?: Date | string;
  mobile?: string;
  email?: string;
  designation?: string;
  dojJob?: Date | string;
  doRetirement?: Date | string;
  branch?: string;
  dojSociety?: Date | string;
  officeAddress?: string;
  residenceAddress?: string;
  city?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  nominee?: string;
  nomineeRelation?: string;
  shareAmount: number;
  cdAmount: number;
  bankName?: string;
  payableAt?: string;
  accountNo?: string;
  status?: string;
  date?: Date | string;
  photoPath?: string;
  signaturePath?: string;
  shareDeduction?: number;
  withdrawal?: number;
  gLoanInstalment?: number;
  eLoanInstalment?: number;
  societyId?: number;
  createdDate?: Date | string;
  updatedDate?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://0.0.0.0:5000/api/members';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMemberByNumber(memberNo: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/by-number/${memberNo}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createMember(member: Member): Observable<Member> {
    const memberData = this.prepareMemberData(member);
    
    return this.http.post<Member>(this.apiUrl, memberData, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateMember(id: number, member: Member): Observable<Member> {
    const memberData = this.prepareMemberData(member);
    
    return this.http.put<Member>(`${this.apiUrl}/${id}`, memberData, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private prepareMemberData(member: Member): any {
    const data = { ...member };
    
    // Add current user's society ID if not provided
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.societyId && !data.societyId) {
      data.societyId = currentUser.societyId;
    }
    
    // Convert date objects to ISO strings for API
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString();
    }
    if (data.dojJob instanceof Date) {
      data.dojJob = data.dojJob.toISOString();
    }
    if (data.doRetirement instanceof Date) {
      data.doRetirement = data.doRetirement.toISOString();
    }
    if (data.dojSociety instanceof Date) {
      data.dojSociety = data.dojSociety.toISOString();
    }
    if (data.date instanceof Date) {
      data.date = data.date.toISOString();
    }
    
    return data;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request - Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - Please login again';
          break;
        case 403:
          errorMessage = 'Forbidden - You do not have permission';
          break;
        case 404:
          errorMessage = 'Not Found - The requested resource was not found';
          break;
        case 409:
          errorMessage = 'Conflict - Member number already exists';
          break;
        case 500:
          errorMessage = 'Internal Server Error - Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
