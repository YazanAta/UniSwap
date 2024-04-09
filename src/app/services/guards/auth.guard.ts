import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs';

/**
 * Guard function to restrict access to routes based on user authentication status.
 *
 * This guard checks if there is an authenticated user. If there is no authenticated user,
 * the guard resolves to true, allowing navigation to the requested route. If there is an
 * authenticated user (indicating that the user is already logged in), the guard redirects
 * to the home route ('/') and resolves to false, preventing navigation.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns A Promise<boolean> representing whether the route can be activated.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if (!user) {
        resolve(true); // Allow navigation if there is no authenticated user
      } else {
        router.navigate(['']); // Redirect to home route if user is already authenticated
        resolve(false);
      }
    });
  });
};
