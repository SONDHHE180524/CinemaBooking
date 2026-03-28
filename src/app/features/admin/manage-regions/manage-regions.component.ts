import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Region } from '../../../models/admin.model';

@Component({
  selector: 'app-manage-regions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-container">
      <h2 style="margin-bottom: 25px; color: #2c3e50;">Chọn Vùng Miền để tiếp tục</h2>
      
      <!-- Loading State -->
      <div class="loading-state" *ngIf="regions === null">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Clickable Regions from Database -->
      <div class="region-cards" *ngIf="regions !== null && regions.length > 0">
        <div class="region-card dynam-card" *ngFor="let region of regions" (click)="viewCities(region)">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ region.name }}</span>
        </div>
      </div>

      <!-- Empty State (only shown after data has loaded) -->
      <div class="empty-msg" *ngIf="regions !== null && regions.length === 0">
        <i class="fas fa-exclamation-circle"></i>
        <p>Không có dữ liệu Vùng Miền trong database.</p>
        <button class="btn btn-primary" (click)="loadRegions()" style="margin-top: 15px;">Thử tải lại</button>
      </div>

      <!-- Modal Add/Edit -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <h3>{{ editingRegion ? 'Sửa' : 'Thêm' }} Vùng Miền</h3>
          <div class="form-group">
            <label>Tên vùng miền</label>
            <input type="text" [(ngModel)]="currentRegion.name" class="form-control" placeholder="Nhập tên vùng miền" />
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveRegion()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-container {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header-actions h2 {
      margin: 0;
      color: #2c3e50;
    }
    .region-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .region-card {
      background: #f8f9fa;
      padding: 30px 20px;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    .region-card i {
      font-size: 2.5rem;
      color: #bdc3c7;
      transition: color 0.3s;
    }
    .region-card span {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2c3e50;
    }
    .region-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      background: #fff;
      border-color: #3498db;
    }
    .region-card:hover i { color: #3498db; }

    .loading-state { text-align: center; padding: 50px; color: #3498db; }
    .loading-state i { font-size: 3rem; margin-bottom: 20px; display: block; }
    .empty-msg {
      text-align: center;
      padding: 50px;
      color: #7f8c8d;
    }
    .empty-msg i {
      font-size: 3rem;
      margin-bottom: 15px;
      color: #e67e22;
    }

    .btn {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.3s;
    }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background: #3498db; color: #fff; }
    .btn-secondary { background: #95a5a6; color: #fff; }
    .btn-view { background: #1abc9c; color: #fff; margin-right: 5px; }
    .btn-edit { background: #f39c12; color: #fff; margin-right: 5px; }
    .btn-delete { background: #e74c3c; color: #fff; }
    
    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }
    .admin-table th, .admin-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    .admin-table th {
      background-color: #f8f9fa;
      color: #2c3e50;
    }
    .text-center { text-align: center; }

    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      max-width: 90%;
    }
    .modal-content h3 { margin-top: 0; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class ManageRegionsComponent implements OnInit {
  @Output() onSelect = new EventEmitter<Region>();
  regions: Region[] | null = null;
  errorMsg = '';
  showModal = false;
  editingRegion = false;
  currentRegion: Partial<Region> = {};

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadRegions();
  }

  loadRegions(): void {
    this.regions = null; // Set to null to show loading state
    this.errorMsg = '';
    this.adminService.getRegions().subscribe({
      next: (data) => {
        console.log('Regions loaded:', data);
        this.regions = data;
        if (data.length === 0) {
          console.warn('API returned empty regions list from DB.');
        }
      },
      error: (err) => {
        console.error('Lỗi khi tải vùng miền:', err);
        this.regions = []; // Set to empty array to show empty state after error
        this.errorMsg = 'Lỗi kết nối tới Server.';
      }
    });
  }

  viewCities(region: Region): void {
    this.onSelect.emit(region);
  }

  openModal(): void {
    this.editingRegion = false;
    this.currentRegion = {};
    this.showModal = true;
  }

  editRegion(region: Region): void {
    this.editingRegion = true;
    this.currentRegion = { ...region };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRegion(): void {
    if (!this.currentRegion.name) {
      alert('Vui lòng nhập tên vùng miền!');
      return;
    }

    if (this.editingRegion && this.currentRegion.id) {
      this.adminService.updateRegion(this.currentRegion.id, this.currentRegion).subscribe({
        next: () => {
          this.loadRegions();
          this.closeModal();
        },
        error: (err) => alert('Lỗi khi cập nhật: ' + err.message)
      });
    } else {
      this.adminService.createRegion(this.currentRegion).subscribe({
        next: () => {
          this.loadRegions();
          this.closeModal();
        },
        error: (err) => alert('Lỗi khi thêm mới: ' + err.message)
      });
    }
  }

  deleteRegion(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa vùng miền này? Việc này sẽ không thành công nếu vùng miền đã có thành phố.')) {
      this.adminService.deleteRegion(id).subscribe({
        next: () => this.loadRegions(),
        error: (err) => {
          console.error(err);
          alert('Không thể xóa. Cần xóa các thành phố thuộc vùng miền này trước.');
        }
      });
    }
  }
}
