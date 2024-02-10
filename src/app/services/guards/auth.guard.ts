import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuardUser: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  return new Promise(resolve => {
    authService.user.subscribe(user => {
      if (user){
        if(user.emailVerified){
          resolve(true);
        }
      }
      else {
        router.navigate(['/pages/login']);
        resolve(false)
      }
    })
  })

};

export const authGuardNotUser: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  return new Promise(resolve => {
    authService.user.subscribe(user => {
      if (!user) resolve(true);
      else {
        router.navigate(['']);
        resolve(false)
      }
    })
  })

};
