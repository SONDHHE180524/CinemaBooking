import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAuthenticated()) {
    return true;
  }

  // Chưa đăng nhập → redirect về login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const guestGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Đã đăng nhập rồi → không cho vào trang login/register nữa
  if (!tokenService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
