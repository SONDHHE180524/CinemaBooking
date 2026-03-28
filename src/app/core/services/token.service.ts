import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      if (!expiry) return false;
      
      // Kiểm tra nếu hiện tại đã quá thời gian expire (giây)
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch {
      return true;
    }
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp || null;
    } catch {
      return null;
    }
  }
}
