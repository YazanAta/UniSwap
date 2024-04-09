import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs';

/**
 * Guard function to restrict access to routes based on user role.
 *
 * This guard checks if there is an authenticated user and verifies if the user's role
 * is 'user'. If the user is authenticated and has the role of 'user', the guard resolves
 * to true, allowing navigation to the requested route. If the user is authenticated but
 * does not have the role of 'user', the guard redirects to the '/admin' route and resolves
 * to false, preventing navigation. If there is no authenticated user, the guard redirects
 * to the '/pages/login' route and resolves to false, also preventing navigation.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns A Promise<boolean> representing whether the route can be activated.
 */
export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        authService.user$.pipe(take(1)).subscribe((data) => {
          if (data.role === 'user') {
            resolve(true); // Allow navigation if user has the role of 'user'
          } else {
            router.navigate(['/admin']); // Redirect to admin route if user does not have the role of 'user'
            resolve(false);
          }
        });
      } else {
        router.navigate(['/pages/login']); // Redirect to login route if there is no authenticated user
        resolve(false);
      }
    });
  });
};
