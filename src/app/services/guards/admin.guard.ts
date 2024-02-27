import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  return new Promise(resolve => {
    return authService.user$.pipe(take(1)).subscribe((user) => {
      if(user){
        authService.user$.pipe(take(1)).subscribe((data) => {
          if(data.role === "admin"){
            resolve(true);
          }else{
            router.navigate[''];
            resolve(false);
          }
        })
      }else{
        router.navigate['/login'];
        resolve(false);
      }
    })
  })

}



