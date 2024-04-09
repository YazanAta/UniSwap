import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs';

/**
 * Guard function to restrict access to routes for authenticated users (guests).
 *
 * This guard checks if there is no authenticated user. If there is no authenticated user
 * (i.e., the user is a guest), the guard resolves to true, allowing navigation to the
 * requested route. If there is an authenticated user, the guard checks the user's role.
 * If the user is authenticated as an 'admin', the guard redirects to the '/admin' route
 * and resolves to false, preventing navigation. If the user is authenticated but not as
 * an 'admin', the guard resolves to true, allowing navigation.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns A Promise<boolean> representing whether the route can be activated.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if (!user) {
        resolve(true); // Allow navigation if user is not authenticated (guest)
      } else {
        authService.user$.pipe(take(1)).subscribe((data) => {
          if (data.role === "admin") {
            router.navigate(['/admin']); // Redirect to admin route if user is authenticated as an admin
            resolve(false);
          } else {
            resolve(true); // Allow navigation if user is authenticated but not as an admin
          }
        });
      }
    });
  });
};
