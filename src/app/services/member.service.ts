
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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
  createdDate?: Date | string;
  updatedDate?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:5000/api/members';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMemberByNumber(memberNo: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/by-number/${memberNo}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createMember(member: Member): Observable<Member> {
    // Convert dates to proper format
    const memberData = this.prepareMemberData(member);
    
    return this.http.post<Member>(this.apiUrl, memberData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateMember(id: number, member: Member): Observable<Member> {
    // Convert dates to proper format
    const memberData = this.prepareMemberData(member);
    
    return this.http.put<Member>(`${this.apiUrl}/${id}`, memberData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private prepareMemberData(member: Member): any {
    const data = { ...member };
    
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
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
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
