import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header glass animate-slide-down">
      <div class="container header-content">
        <div class="logo" routerLink="/">
          <span class="logo-icon">🎬</span>
          <span class="logo-text outfit">CINEMA<span class="accent">MAX</span></span>
        </div>
        
        <nav class="nav">
          <ul class="nav-links">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Trang Chủ</a></li>
            <li><a href="#">Phim</a></li>
            <li><a href="#">Rạp</a></li>
            <li><a href="#">Khuyến Mãi</a></li>
          </ul>
        </nav>

        <div class="actions">
          <button class="btn-search" title="Tìm kiếm">🔍</button>
          
          <ng-container *ngIf="authService.currentUser as user; else guestMenu">
            
            <!-- Nút vào trang Admin (chỉ hiển thị nếu role là Admin) -->
            <button *ngIf="user.role === 'Admin'" class="btn-admin pulse-effect" routerLink="/admin" title="Vào trang Quản Trị">
              <span class="icon">🛡️</span> Quản Trị
            </button>

            <div class="notification-wrapper" (click)="$event.stopPropagation()">
              <button class="btn-bell" (click)="toggleNotif()">
                🔔
                <span class="badge" *ngIf="notificationService.unreadCount() > 0">
                  {{ notificationService.unreadCount() }}
                </span>
              </button>
              
              <div class="notification-dropdown glass" *ngIf="isNotifOpen">
                <div class="notif-header">
                  <h4>Thông báo</h4>
                </div>
                <div class="notif-body">
                  <div class="notif-item" *ngFor="let notif of notificationService.notifications()" [class.unread]="!notif.isRead">
                    <div class="notif-icon">{{ notif.type === 'Security' ? '🔒' : '👤' }}</div>
                    <div class="notif-content">
                      <p class="notif-title">{{ notif.title }}</p>
                      <p class="notif-msg">{{ notif.message }}</p>
                      <span class="notif-time">{{ notif.createdAt | date:'short' }}</span>
                    </div>
                  </div>
                  <div class="notif-empty" *ngIf="notificationService.notifications().length === 0">
                    Không có thông báo nào.
                  </div>
                </div>
              </div>
            </div>

            <div class="user-profile">
              <a class="user-info" routerLink="/profile">
                <div class="avatar-wrapper">
                  <span class="avatar-icon">👤</span>
                  <div class="status-indicator"></div>
                </div>
                <div class="user-details">
                  <span class="welcome-text">Xin chào,</span>
                  <span class="user-name outfit">{{ user.fullName }}</span>
                </div>
              </a>
              <button class="btn-logout-icon" (click)="logout()" title="Đăng xuất">
                <span class="logout-text">Đăng xuất</span>
                <span class="icon">󰗼</span>
              </button>
            </div>
          </ng-container>

          <ng-template #guestMenu>
            <button class="btn-login outfit pulse-effect" routerLink="/login">
              Đăng Nhập
            </button>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: `
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--glass-border);
      transition: var(--transition-smooth);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.6rem;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .logo:hover { transform: scale(1.05); }
    .logo-text { font-weight: 800; }
    .accent { color: var(--accent-primary); text-shadow: 0 0 10px var(--accent-glow); }

    .nav-links { display: flex; gap: 2.5rem; }
    .nav-links a { 
      color: var(--text-secondary); 
      font-weight: 500; 
      font-size: 1rem;
      position: relative;
      padding: 0.5rem 0;
    }
    .nav-links a:hover, .nav-links a.active { color: var(--text-primary); }
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent-primary);
      transition: width 0.3s ease;
      box-shadow: 0 0 8px var(--accent-glow);
    }
    .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }

    .actions { display: flex; align-items: center; gap: 1.5rem; }
    .btn-search { 
      font-size: 1.2rem; 
      color: var(--text-secondary);
      padding: 0.5rem;
      border-radius: 50%;
    }
    .btn-search:hover { background: rgba(255,255,255,0.1); color: var(--text-primary); }

    .btn-login {
      background: linear-gradient(135deg, var(--accent-primary) 0%, #b30710 100%);
      color: white;
      padding: 0.7rem 1.8rem;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 4px 15px var(--accent-glow);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px var(--accent-glow);
    }

    .btn-admin {
      background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 12px;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
    }
    .btn-admin:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(243, 156, 18, 0.5);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      padding: 0.4rem 0.8rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50px;
      border: 1px solid var(--glass-border);
      animation: fadeIn 0.5s ease-out;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
    }

    .avatar-wrapper {
      position: relative;
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #333 0%, #111 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid var(--glass-border);
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background: #4caf50;
      border-radius: 50%;
      border: 2px solid #1a1a1a;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .welcome-text {
      font-size: 0.7rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .btn-logout-icon {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-secondary);
      font-size: 0.85rem;
      transition: all 0.3s ease;
    }

    .btn-logout-icon:hover {
      background: rgba(229, 9, 20, 0.15);
      color: var(--accent-primary);
    }

    .pulse-effect {
      animation: pulseGlow 3s infinite;
    }

    /* ── Notifications ── */
    .notification-wrapper {
      position: relative;
    }
    .btn-bell {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--glass-border);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-bell:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--accent-primary);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.1rem 0.4rem;
      border-radius: 10px;
      border: 2px solid #1a1a1a;
      animation: popIn 0.3s ease-out;
    }
    .notification-dropdown {
      position: absolute;
      top: 130%;
      right: -10px;
      width: 320px;
      background: rgba(20, 20, 20, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 1000;
      animation: slideDown 0.2s ease-out;
      overflow: hidden;
    }
    .notif-header {
      padding: 1rem;
      border-bottom: 1px solid var(--glass-border);
    }
    .notif-header h4 { margin: 0; font-size: 1rem; font-weight: 600; color: white;}
    .notif-body {
      max-height: 350px;
      overflow-y: auto;
    }
    .notif-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: background 0.2s;
    }
    .notif-item:hover { background: rgba(255,255,255,0.08); }
    .notif-item.unread { background: rgba(229, 9, 20, 0.1); }
    .notif-icon { font-size: 1.5rem; flex-shrink: 0; }
    .notif-title { font-weight: 600; margin-bottom: 0.3rem; font-size: 0.9rem; color: white; }
    .notif-msg { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem; line-height: 1.4; }
    .notif-time { font-size: 0.7rem; color: #888; }
    .notif-empty { padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem; }
    @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `
})
export class Header {
  isNotifOpen = false;

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private router: Router
  ) {
    // Tự động lấy thông báo mỗi khi trạng thái đăng nhập thay đổi
    effect(() => {
      const user = this.authService.currentUser;
      if (user) {
        this.notificationService.fetchNotifications().subscribe();
      } else {
        // Đăng xuất thì dọn sạch thông báo cũ
        this.notificationService.notifications.set([]);
        this.notificationService.unreadCount.set(0);
      }
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', () => {
      this.isNotifOpen = false;
    });
  }

  toggleNotif() {
    this.isNotifOpen = !this.isNotifOpen;
    if (this.isNotifOpen && this.notificationService.unreadCount() > 0) {
      this.notificationService.markAsRead().subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
