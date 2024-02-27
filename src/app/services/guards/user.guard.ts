import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if(user){
        authService.user$.pipe(take(1)).subscribe((data) => {
          if(data.role === 'user'){
            resolve(true);
          }else{
            router.navigate(['/admin']);
            resolve(false);
          }
        })
      }else{
        router.navigate(['/pages/login'])
        resolve(false);
      }
    })

    
  })
};
