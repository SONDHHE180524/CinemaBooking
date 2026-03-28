import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Chào mừng bạn đến với hệ thống quản trị rạp chiếu phim!</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon"><i class="fas fa-map"></i></div>
          <div class="info">
            <h3>Quản lý Vùng Miền</h3>
            <p>Thiết lập các khu vực</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon"><i class="fas fa-city"></i></div>
          <div class="info">
            <h3>Quản lý Thành Phố</h3>
            <p>Các thành phố có rạp</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon"><i class="fas fa-building"></i></div>
          <div class="info">
            <h3>Quản lý Rạp Phim</h3>
            <p>Hệ thống rạp chiếu</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon"><i class="fas fa-film"></i></div>
          <div class="info">
            <h3>Quản lý Phim</h3>
            <p>Danh sách phim hiện có</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    p {
      color: #7f8c8d;
      margin-bottom: 30px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    }
    .icon {
      font-size: 40px;
      color: #3498db;
      margin-right: 20px;
    }
    .info h3 {
      margin: 0;
      color: #34495e;
      font-size: 18px;
    }
    .info p {
      margin: 5px 0 0;
      color: #95a5a6;
      font-size: 14px;
    }
  `]
})
export class DashboardComponent {
}
