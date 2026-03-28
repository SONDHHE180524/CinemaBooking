import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Cinema Admin</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active">
            <i class="fas fa-home"></i> Dashboard
          </a>
          <a routerLink="/admin/system" routerLinkActive="active">
            <i class="fas fa-cogs"></i> Quản lý Hệ Thống
          </a>
          <a routerLink="/admin/users" routerLinkActive="active">
            <i class="fas fa-users"></i> Quản lý Users
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Topbar -->
        <header class="topbar">
          <div class="search-bar"></div>
          <div class="user-info">
            <span *ngIf="adminName" class="greeting">Xin chào, {{ adminName }}</span>
            <div class="action-buttons">
              <a routerLink="/" class="home-btn" title="Về trang chủ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </a>
              <button class="logout-btn" (click)="logout()" title="Đăng xuất">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Route Outlet -->
        <main class="content-body">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      height: 100vh;
      background-color: #f4f6f9;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .sidebar {
      width: 250px;
      background-color: #2c3e50;
      color: #fff;
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 20px;
      text-align: center;
      background-color: #1a252f;
      border-bottom: 1px solid #34495e;
    }
    .sidebar-header h2 {
      margin: 0;
      font-size: 20px;
      color: #1abc9c;
    }
    .sidebar-nav {
      flex: 1;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
    }
    .sidebar-nav a {
      color: #bdc3c7;
      text-decoration: none;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      transition: background 0.3s, color 0.3s;
    }
    .sidebar-nav a:hover, .sidebar-nav a.active {
      background-color: #34495e;
      color: #fff;
      border-left: 4px solid #1abc9c;
    }
    .sidebar-nav a i {
      margin-right: 15px;
      width: 20px;
      text-align: center;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .topbar {
      height: 60px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .greeting {
      color: #34495e;
      font-weight: 500;
      font-size: 15px;
    }
    .action-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .home-btn {
      color: #7f8c8d;
      font-size: 18px;
      text-decoration: none;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
    }
    .home-btn:hover {
      color: #3498db;
      background: #e1e8ed;
      border-color: #d1d8dd;
    }
    .logout-btn {
      color: #e74c3c;
      background: #fdf2e9;
      border: 1px solid #fadbd8;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    .logout-btn:hover {
      background-color: #e74c3c;
      color: white;
      border-color: #e74c3c;
    }
    .content-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  adminName: string = 'Admin';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user && user.fullName) {
      this.adminName = user.fullName;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
