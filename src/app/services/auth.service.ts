import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  societyId?: number;
  societyName?: string;
  isActive: boolean;
  createdDate: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  SOCIETY_ADMIN = 'SocietyAdmin',
  USER = 'User',
  BRANCH_ADMIN = 'BranchAdmin',
  ACCOUNTANT = 'Accountant',
  MEMBER = 'Member'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
  societyId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://0.0.0.0:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<boolean> {
    const loginRequest: LoginRequest = { username, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest, this.httpOptions)
      .pipe(
        map(response => {
          if (response && response.token && response.user) {
            this.currentUserSubject.next(response.user);
            this.isLoggedInSubject.next(true);

            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
              localStorage.setItem('token', response.token);
            }
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  hasPermission(module: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) return true;

    // Add your permission logic here based on roles
    switch (user.role) {
      case UserRole.SOCIETY_ADMIN:
        return ['members', 'accounts', 'transactions', 'reports', 'master'].includes(module);
      case UserRole.BRANCH_ADMIN:
        return ['members', 'accounts', 'transactions', 'reports'].includes(module);
      case UserRole.ACCOUNTANT:
        return ['accounts', 'transactions', 'reports'].includes(module);
      case UserRole.USER:
        return ['members', 'accounts'].includes(module) && action === 'read';
      case UserRole.MEMBER:
        return module === 'members' && action === 'read';
      default:
        return false;
    }
  }

  canAccessRoute(route: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (user.role === UserRole.SUPER_ADMIN) return true;

    // Add route-specific permissions
    const routePermissions: { [key: string]: { module: string, action: string } } = {
      '/master/member-details': { module: 'members', action: 'read' },
      '/transaction/deposit-receipt': { module: 'transactions', action: 'read' },
      '/accounts/cash-book': { module: 'accounts', action: 'read' },
      '/file/security/authority': { module: 'all', action: 'read' },
      '/file/security/new-user': { module: 'all', action: 'create' }
    };

    const permission = routePermissions[route];
    if (!permission) return true;

    return this.hasPermission(permission.module, permission.action);
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.post<User>(`${this.apiUrl}/register`, userData, { headers })
      .pipe(
        catchError(error => {
          console.error('Create user error:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentUserProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/me`, { headers })
      .pipe(
        catchError(error => {
          console.error('Get current user error:', error);
          return throwError(() => error);
        })
      );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');

      if (userData && token) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      }
    }
  }

  getUserRoles(): string[] {
    return Object.values(UserRole);
  }

  canCreateRole(targetRole: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    switch (currentUser.role) {
      case UserRole.SUPER_ADMIN:
        return true;
      case UserRole.SOCIETY_ADMIN:
        return [UserRole.USER, UserRole.ACCOUNTANT, UserRole.MEMBER].includes(targetRole as UserRole);
      case UserRole.BRANCH_ADMIN:
        return [UserRole.USER, UserRole.MEMBER].includes(targetRole as UserRole);
      default:
        return false;
    }
  }
}