
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    const requiredRoles = route.data['roles'] as UserRole[];

    if (currentUser && requiredRoles.includes(currentUser.role)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
