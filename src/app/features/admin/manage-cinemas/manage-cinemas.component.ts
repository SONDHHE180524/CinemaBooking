import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Cinema, City } from '../../../models/admin.model';

@Component({
  selector: 'app-manage-cinemas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-container">
      <h2 style="margin-bottom: 25px; color: #2c3e50;">Chọn Rạp Chiếu để tiếp tục</h2>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="cinemas === null">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Clickable Cinemas from Database -->
      <div class="cinema-cards" *ngIf="cinemas !== null && filteredCinemas.length > 0">
        <div class="cinema-card dynam-card" *ngFor="let cinema of filteredCinemas" (click)="onSelectCinema(cinema)">
          <div class="card-status" [ngClass]="cinema.isActive ? 'active' : 'inactive'">
            {{ cinema.isActive ? 'Đang mở' : 'Tạm đóng' }}
          </div>
          <i class="fas fa-film"></i>
          <span class="cinema-name">{{ cinema.name }}</span>
          <span class="cinema-address">{{ cinema.address }}</span>
          <div class="cinema-contact" *ngIf="cinema.hotline">
            <i class="fas fa-phone-alt"></i> {{ cinema.hotline }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-msg" *ngIf="cinemas !== null && filteredCinemas.length === 0">
        <i class="fas fa-exclamation-circle"></i>
        <p>Không có dữ liệu Rạp Chiếu nào thuộc thành phố này.</p>
        <button class="btn btn-primary" (click)="loadCinemas()" style="margin-top: 15px;">Thử tải lại</button>
      </div>

      <!-- Modal Add/Edit -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content large-modal">
          <h3>{{ editingCinema ? 'Sửa' : 'Thêm' }} Rạp Chiếu</h3>
          
          <div class="form-row">
            <div class="form-group col">
              <label>Tên rạp</label>
              <input type="text" [(ngModel)]="currentCinema.name" class="form-control" placeholder="Nhập tên rạp" />
            </div>
            <div class="form-group col">
              <label>Thuộc Thành Phố</label>
              <select [(ngModel)]="currentCinema.cityId" class="form-control">
                <option *ngFor="let city of cities" [value]="city.id">{{ city.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Địa chỉ</label>
            <input type="text" [(ngModel)]="currentCinema.address" class="form-control" placeholder="Nhập địa chỉ" />
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label>Hotline</label>
              <input type="text" [(ngModel)]="currentCinema.hotline" class="form-control" placeholder="Nhập hotline" />
            </div>
            <div class="form-group col">
              <label>Hoạt động</label>
              <select [(ngModel)]="currentCinema.isActive" class="form-control">
                <option [ngValue]="true">Đang hoạt động</option>
                <option [ngValue]="false">Tạm dừng</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Link Logo (Tùy chọn)</label>
            <input type="text" [(ngModel)]="currentCinema.logoUrl" class="form-control" placeholder="Nhập URL logo" />
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveCinema()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .cinema-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin-bottom: 20px;
    }
    .cinema-card {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      position: relative;
    }
    .card-status {
      position: absolute;
      top: 10px; right: 10px;
      font-size: 0.75rem;
      padding: 3px 10px;
      border-radius: 10px;
      color: #fff;
    }
    .card-status.active { background: #2ecc71; }
    .card-status.inactive { background: #e74c3c; }

    .cinema-card i.fa-film {
      font-size: 3rem;
      color: #bdc3c7;
      margin-bottom: 5px;
    }
    .cinema-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2c3e50;
    }
    .cinema-address {
      font-size: 0.95rem;
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    .cinema-contact {
      font-size: 0.9rem;
      color: #3498db;
      font-weight: 500;
    }
    .cinema-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      background: #fff;
      border-color: #3498db;
    }
    .cinema-card:hover i.fa-film { color: #3498db; }

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

    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: opacity 0.3s; }
    
    .loading-state { text-align: center; padding: 50px; color: #3498db; }
    .loading-state i { font-size: 3rem; margin-bottom: 20px; display: block; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #fff; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%; }
    .large-modal { width: 600px; }
    .modal-content h3 { margin-top: 0; }
    .form-group { margin-bottom: 15px; }
    .form-row { display: flex; gap: 15px; }
    .form-row .col { flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ManageCinemasComponent implements OnInit {
  @Input() filterCityId?: number;
  @Output() onSelect = new EventEmitter<Cinema>();
  cinemas: Cinema[] | null = null;
  cities: City[] = [];
  showModal = false;
  editingCinema = false;
  currentCinema: Partial<Cinema> = {};

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCinemas();
    this.loadCities();
  }

  get filteredCinemas(): Cinema[] {
    if (!this.cinemas) return [];
    if (!this.filterCityId) return this.cinemas;
    return this.cinemas.filter(c => c.cityId === this.filterCityId);
  }

  loadCinemas(): void {
    this.cinemas = null;
    this.adminService.getCinemas().subscribe({
      next: (data) => this.cinemas = data,
      error: () => this.cinemas = []
    });
  }

  loadCities(): void {
    this.adminService.getCities().subscribe(data => this.cities = data);
  }

  onSelectCinema(cinema: Cinema): void {
    this.onSelect.emit(cinema);
  }

  openModal(): void {
    this.editingCinema = false;
    this.currentCinema = {
      isActive: true,
      cityId: this.filterCityId || (this.cities.length > 0 ? this.cities[0].id : undefined)
    };
    this.showModal = true;
  }

  editCinema(cinema: Cinema): void {
    this.editingCinema = true;
    this.currentCinema = { ...cinema };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCinema(): void {
    if (!this.currentCinema.name || !this.currentCinema.cityId || !this.currentCinema.address) {
      alert('Vui lòng nhập đầy đủ tên, địa chỉ và chọn thành phố!');
      return;
    }

    if (this.editingCinema && this.currentCinema.id) {
      this.adminService.updateCinema(this.currentCinema.id, this.currentCinema).subscribe({
        next: () => { this.loadCinemas(); this.closeModal(); },
        error: (err) => alert('Lỗi: ' + err.message)
      });
    } else {
      this.adminService.createCinema(this.currentCinema).subscribe({
        next: () => { this.loadCinemas(); this.closeModal(); },
        error: (err) => alert('Lỗi: ' + err.message)
      });
    }
  }

  deleteCinema(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa rạp này?')) {
      this.adminService.deleteCinema(id).subscribe({
        next: () => this.loadCinemas(),
        error: (err) => alert('Không thể xóa rạp có chứa phòng chiếu/lịch chiếu.')
      });
    }
  }
}
