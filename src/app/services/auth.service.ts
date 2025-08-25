import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  societyId?: number;
  societyName?: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdBy?: number;
  createdDate: Date;
  lastLogin?: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SOCIETY_ADMIN = 'society_admin',
  BRANCH_ADMIN = 'branch_admin',
  ACCOUNTANT = 'accountant',
  OPERATOR = 'operator',
  MEMBER = 'member'
}

export interface Permission {
  module: string;
  actions: string[]; // create, read, update, delete, approve
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      username: 'superadmin',
      email: 'superadmin@system.com',
      role: UserRole.SUPER_ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
      createdDate: new Date('2024-01-01')
    },
    {
      id: 2,
      username: 'societyadmin',
      email: 'admin@society1.com',
      role: UserRole.SOCIETY_ADMIN,
      societyId: 1,
      societyName: 'ABC Society',
      firstName: 'Society',
      lastName: 'Admin',
      isActive: true,
      createdBy: 1,
      createdDate: new Date('2024-01-15')
    },
    {
      id: 3,
      username: 'accountant1',
      email: 'accountant1@society1.com',
      role: UserRole.ACCOUNTANT,
      societyId: 1,
      societyName: 'ABC Society',
      firstName: 'John',
      lastName: 'Accountant',
      isActive: true,
      createdBy: 2,
      createdDate: new Date('2024-02-01')
    },
    {
      id: 4,
      username: 'member1',
      email: 'member1@society1.com',
      role: UserRole.MEMBER,
      societyId: 1,
      societyName: 'ABC Society',
      firstName: 'Jane',
      lastName: 'Member',
      isActive: true,
      createdBy: 2,
      createdDate: new Date('2024-02-15')
    }
  ];

  private rolePermissions: Map<UserRole, Permission[]> = new Map([
    [UserRole.SUPER_ADMIN, [
      { module: 'all', actions: ['create', 'read', 'update', 'delete', 'approve'] }
    ]],
    [UserRole.SOCIETY_ADMIN, [
      { module: 'members', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'accounts', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'transactions', actions: ['create', 'read', 'update', 'approve'] },
      { module: 'reports', actions: ['read'] },
      { module: 'master', actions: ['create', 'read', 'update'] },
      { module: 'accountants', actions: ['create', 'read', 'update', 'delete'] }
    ]],
    [UserRole.ACCOUNTANT, [
      { module: 'accounts', actions: ['create', 'read', 'update'] },
      { module: 'transactions', actions: ['create', 'read', 'update'] },
      { module: 'reports', actions: ['read'] },
      { module: 'members', actions: ['read'] }
    ]],
    [UserRole.MEMBER, [
      { module: 'own-account', actions: ['read'] },
      { module: 'own-transactions', actions: ['read'] }
    ]]
  ]);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.users.find(u => u.username === username && u.isActive);
        if (user && password === 'password') {
          user.lastLogin = new Date();
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);

          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }

          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasPermission(module: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions = this.rolePermissions.get(user.role);
    if (!permissions) return false;

    // Super admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) return true;

    return permissions.some(permission =>
      (permission.module === module || permission.module === 'all') &&
      permission.actions.includes(action)
    );
  }

  canAccessRoute(route: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (user.role === UserRole.SUPER_ADMIN) return true;

    const routePermissions: { [key: string]: { module: string, action: string } } = {
      '/master/member-details': { module: 'members', action: 'read' },
      '/transaction/deposit-receipt': { module: 'transactions', action: 'read' },
      '/accounts/cash-book': { module: 'accounts', action: 'read' },
      '/file/security/authority': { module: 'all', action: 'read' },
      '/file/security/new-user': { module: 'all', action: 'create' },
      // Add more route mappings as needed
    };

    const permission = routePermissions[route];
    if (!permission) return true; // Allow access to unmapped routes

    return this.hasPermission(permission.module, permission.action);
  }

  createUser(userData: Partial<User>): Observable<User> {
    return new Observable(observer => {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        observer.error('Not authenticated');
        return;
      }

      const newUser: User = {
        id: Math.max(...this.users.map(u => u.id)) + 1,
        username: userData.username!,
        email: userData.email!,
        role: userData.role!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        societyId: userData.societyId || currentUser.societyId,
        societyName: userData.societyName || currentUser.societyName,
        isActive: true,
        createdBy: currentUser.id,
        createdDate: new Date()
      };

      this.users.push(newUser);
      observer.next(newUser);
      observer.complete();
    });
  }

  getUsers(): Observable<User[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return new Observable(obs => obs.next([]));

    let filteredUsers = this.users;

    if (currentUser.role === UserRole.SOCIETY_ADMIN) {
      filteredUsers = this.users.filter(u => u.societyId === currentUser.societyId);
    }

    return new Observable(observer => {
      observer.next(filteredUsers);
      observer.complete();
    });
  }

  updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  deleteUser(userId: number): void {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users[index].isActive = false;
    }
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      }
    }
  }


  getUserRoles(): UserRole[] {
    return Object.values(UserRole);
  }

  canCreateRole(targetRole: UserRole): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    switch (currentUser.role) {
      case UserRole.SUPER_ADMIN:
        return true;
      case UserRole.SOCIETY_ADMIN:
        return [UserRole.ACCOUNTANT, UserRole.MEMBER].includes(targetRole);
      default:
        return false;
    }
  }
}