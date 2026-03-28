import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = tokenService.getToken();
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');
  
  // 1. Kiểm tra Token hết hạn chủ động (Bỏ qua nếu là request login/register)
  if (!isAuthRequest && token && tokenService.isTokenExpired()) {
    authService.logout({ queryParams: { expired: true } });
    return throwError(() => new Error('Token expired'));
  }

  // 2. Proactive Refresh (Silent Refresh) - Nếu còn dưới 5 phút
  const expiration = tokenService.getTokenExpiration();
  const now = Math.floor(Date.now() / 1000);
  if (token && expiration && (expiration - now < 300) && !authService.isRefreshing()) {
    // Gọi refresh ngầm, không chặn request này
    authService.refreshToken().subscribe();
  }

  let clonedReq = req;
  if (token && !isAuthRequest) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized - Token expired hoặc không có quyền
      if (error.status === 401) {
        authService.logout({ queryParams: { expired: true } });
      }
      return throwError(() => error);
    })
  );
};
