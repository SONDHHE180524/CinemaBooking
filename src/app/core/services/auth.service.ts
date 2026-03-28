import { Injectable, signal } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiMessageResponse
} from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal lưu trạng thái user hiện tại
  private _currentUser = signal<AuthResponse | null>(this.loadUserFromStorage());
  
  // Đồng bộ hóa việc refresh token
  public isRefreshing = signal<boolean>(false);
  
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  // Getter để components đọc user hiện tại
  get currentUser() {
    return this._currentUser();
  }

  get isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  // ── Đăng nhập ─────────────────────────────────────────────
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(res => {
        if (res.token) {
          this.tokenService.setToken(res.token);
          this._currentUser.set(res);
          localStorage.setItem('cinema_user', JSON.stringify(res));
        }
      })
    );
  }

  // ── Đăng ký ───────────────────────────────────────────────
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap(res => {
        if (res.token) {
          this.tokenService.setToken(res.token);
          this._currentUser.set(res);
          localStorage.setItem('cinema_user', JSON.stringify(res));
        }
      })
    );
  }

  // ── Đổi mật khẩu ──────────────────────────────────────────
  changePassword(data: ChangePasswordRequest): Observable<ApiMessageResponse> {
    return this.apiService.post<ApiMessageResponse>('/auth/change-password', data);
  }

  // ── Quên mật khẩu (gửi OTP) ───────────────────────────────
  forgotPassword(data: ForgotPasswordRequest): Observable<ApiMessageResponse> {
    return this.apiService.post<ApiMessageResponse>('/auth/forgot-password', data);
  }

  // ── Đặt lại mật khẩu bằng OTP ─────────────────────────────
  resetPassword(data: ResetPasswordRequest): Observable<ApiMessageResponse> {
    return this.apiService.post<ApiMessageResponse>('/auth/reset-password', data);
  }

  // ── Lấy Profile ───────────────────────────────────────────
  getProfile(): Observable<User> {
    return this.apiService.get<User>('/user/profile');
  }

  // ── Cập nhật Profile ──────────────────────────────────────
  updateProfile(userData: Partial<User>): Observable<any> {
    return this.apiService.put<any>('/user/profile', userData).pipe(
      tap(res => {
        // Cập nhật tên trong currentUser nếu có thay đổi
        const current = this._currentUser();
        if (current && res.profile) {
          const updated = { ...current, fullName: res.profile.fullName };
          this._currentUser.set(updated);
          localStorage.setItem('cinema_user', JSON.stringify(updated));
        }
      })
    );
  }

  // ── Đăng xuất ─────────────────────────────────────────────
  logout(navigationExtras?: any): void {
    this.tokenService.removeToken();
    this._currentUser.set(null);
    localStorage.removeItem('cinema_user');
    if (navigationExtras) {
      this.router.navigate(['/login'], navigationExtras);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // ── Làm mới Token (Silent Refresh) ────────────────────────
  refreshToken(): Observable<AuthResponse> {
    this.isRefreshing.set(true);
    return this.apiService.post<AuthResponse>('/auth/refresh', {}).pipe(
      tap(res => {
        if (res.token) {
          this.tokenService.setToken(res.token);
          this._currentUser.set(res);
          localStorage.setItem('cinema_user', JSON.stringify(res));
        }
      }),
      finalize(() => this.isRefreshing.set(false))
    );
  }

  // Helper: Load user từ localStorage khi khởi động app
  private loadUserFromStorage(): AuthResponse | null {
    try {
      const stored = localStorage.getItem('cinema_user');
      if (stored) return JSON.parse(stored);
    } catch {
      localStorage.removeItem('cinema_user');
    }
    return null;
  }
}
