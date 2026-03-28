import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { City, Region } from '../../../models/admin.model';

@Component({
  selector: 'app-manage-cities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-container">
      <h2 style="margin-bottom: 25px; color: #2c3e50;">Chọn Thành Phố để tiếp tục</h2>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="cities === null">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Clickable Cities from Database -->
      <div class="city-cards" *ngIf="cities !== null && filteredCities.length > 0">
        <div class="city-card dynam-card" *ngFor="let city of filteredCities" (click)="viewCinemas(city)">
          <i class="fas fa-city"></i>
          <span>{{ city.name }}</span>
        </div>
      </div>

      <!-- Empty State (only shown after data has loaded) -->
      <div class="empty-msg" *ngIf="cities !== null && filteredCities.length === 0">
        <i class="fas fa-exclamation-circle"></i>
        <p>Không có dữ liệu Thành Phố nào thuộc miền này.</p>
        <button class="btn btn-primary" (click)="loadCities()" style="margin-top: 15px;">Thử tải lại</button>
      </div>

      <!-- Modal Add/Edit -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <h3>{{ editingCity ? 'Sửa' : 'Thêm' }} Thành Phố</h3>
          <div class="form-group">
            <label>Tên thành phố</label>
            <input type="text" [(ngModel)]="currentCity.name" class="form-control" placeholder="Nhập tên thành phố" />
          </div>
          <div class="form-group">
            <label>Thuộc Vùng Miền</label>
            <select [(ngModel)]="currentCity.regionId" class="form-control">
              <option *ngFor="let region of regions" [value]="region.id">{{ region.name }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveCity()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .loading-state { text-align: center; padding: 50px; color: #3498db; }
    .loading-state i { font-size: 3rem; margin-bottom: 20px; display: block; }
    .city-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .city-card {
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
    .city-card i { font-size: 2.5rem; color: #bdc3c7; transition: color 0.3s; }
    .city-card span { font-size: 1.2rem; font-weight: 700; color: #2c3e50; }
    .city-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); background: #fff; border-color: #3498db; }
    .city-card:hover i { color: #3498db; }
    .empty-msg { text-align: center; padding: 50px; color: #7f8c8d; }
    .empty-msg i { font-size: 3rem; margin-bottom: 15px; color: #e67e22; display: block; }
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: opacity 0.3s; }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background: #3498db; color: #fff; }
    .btn-secondary { background: #95a5a6; color: #fff; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #fff; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%; }
    .modal-content h3 { margin-top: 0; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ManageCitiesComponent implements OnInit {
  @Input() filterRegionId?: number;
  @Output() onSelect = new EventEmitter<City>();

  cities: City[] | null = null;
  regions: Region[] = [];
  showModal = false;
  editingCity = false;
  currentCity: Partial<City> = {};

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCities();
    this.loadRegions();
  }

  get filteredCities(): City[] {
    if (!this.cities) return [];
    if (!this.filterRegionId) return this.cities;
    return this.cities.filter(c => c.regionId === this.filterRegionId);
  }

  loadCities(): void {
    this.cities = null;
    this.adminService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: () => {
        this.cities = [];
      }
    });
  }

  loadRegions(): void {
    this.adminService.getRegions().subscribe(data => this.regions = data);
  }

  viewCinemas(city: City): void {
    this.onSelect.emit(city);
  }

  openModal(): void {
    this.editingCity = false;
    this.currentCity = {
      regionId: this.filterRegionId || (this.regions.length > 0 ? this.regions[0].id : undefined)
    };
    this.showModal = true;
  }

  editCity(city: City): void {
    this.editingCity = true;
    this.currentCity = { ...city };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCity(): void {
    if (!this.currentCity.name || !this.currentCity.regionId) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.editingCity && this.currentCity.id) {
      this.adminService.updateCity(this.currentCity.id, this.currentCity).subscribe({
        next: () => { this.loadCities(); this.closeModal(); },
        error: (err) => alert('Lỗi: ' + err.message)
      });
    } else {
      this.adminService.createCity(this.currentCity).subscribe({
        next: () => { this.loadCities(); this.closeModal(); },
        error: (err) => alert('Lỗi: ' + err.message)
      });
    }
  }

  deleteCity(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa thành phố này?')) {
      this.adminService.deleteCity(id).subscribe({
        next: () => this.loadCities(),
        error: () => alert('Không thể xóa. Cần xóa các rạp chiếu thuộc thành phố này trước.')
      });
    }
  }
}
