import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if(!user){
        resolve(true)
      }else{
        authService.userAuthState$.pipe(take(1)).subscribe((data) => {
          if(data.role === "admin"){
            router.navigate(['/admin'])
            resolve(false);
          }else{
            resolve(true);
          }
        })
      }
    })
  })
};
