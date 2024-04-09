import { CanActivateFn, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

/**
 * Guard function to check if the user is an admin before activating a route.
 *
 * This guard checks if the authenticated user has the role of "admin".
 * If the user is authenticated and is an admin, the guard resolves to true
 * and allows navigation to the requested route. Otherwise, it redirects to the
 * appropriate route (either '/' or '/login') and resolves to false.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns A Promise<boolean> representing whether the route can be activated.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        authService.user$.pipe(take(1)).subscribe((data) => {
          if (data.role === "admin") {
            resolve(true); // Allow navigation if user is an admin
          } else {
            router.navigate(['']); // Redirect to home if user is not an admin
            resolve(false);
          }
        });
      } else {
        router.navigate(['/login']); // Redirect to login if user is not authenticated
        resolve(false);
      }
    });
  });
};
