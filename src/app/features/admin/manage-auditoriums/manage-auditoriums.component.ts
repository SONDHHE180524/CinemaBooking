import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Auditorium } from '../../../models/admin.model';

@Component({
  selector: 'app-manage-auditoriums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-container">
      <h2 style="margin-bottom: 25px; color: #2c3e50;">Chọn Phòng Chiếu để tiếp tục</h2>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="auditoriums === null">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Clickable Auditoriums from Database -->
      <div class="auditorium-cards" *ngIf="auditoriums !== null && filteredAuditoriums.length > 0">
        <div class="auditorium-card dynam-card" *ngFor="let aud of filteredAuditoriums" (click)="onSelectAuditorium(aud)">
          <div class="card-type">{{ aud.roomType }}</div>
          <i class="fas fa-door-open"></i>
          <span class="auditorium-name">{{ aud.name }}</span>
        </div>
      </div>

      <!-- Empty State (only shown after data has loaded) -->
      <div class="empty-msg" *ngIf="auditoriums !== null && filteredAuditoriums.length === 0">
        <i class="fas fa-exclamation-circle"></i>
        <p>Không có dữ liệu Phòng Chiếu nào cho rạp này.</p>
        <button class="btn btn-primary" (click)="loadAuditoriums()" style="margin-top: 15px;">Thử tải lại</button>
      </div>
    </div>
  `,
  styles: [`
    .manage-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .loading-state { text-align: center; padding: 50px; color: #3498db; }
    .loading-state i { font-size: 3rem; margin-bottom: 20px; display: block; }
    .auditorium-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .auditorium-card {
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
      position: relative;
    }
    .card-type {
      position: absolute;
      top: 10px; right: 10px;
      background: #34495e;
      color: #fff;
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    .auditorium-card i { font-size: 2.5rem; color: #bdc3c7; transition: color 0.3s; }
    .auditorium-name { font-size: 1.2rem; font-weight: 700; color: #2c3e50; }
    .auditorium-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); background: #fff; border-color: #3498db; }
    .auditorium-card:hover i { color: #3498db; }
    .empty-msg { text-align: center; padding: 50px; color: #7f8c8d; }
    .empty-msg i { font-size: 3rem; margin-bottom: 15px; color: #e67e22; display: block; }
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: #3498db; color: #fff; }
  `]
})
export class ManageAuditoriumsComponent implements OnInit {
  @Input() filterCinemaId?: number;
  @Output() onSelect = new EventEmitter<Auditorium>();

  auditoriums: Auditorium[] | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadAuditoriums();
  }

  get filteredAuditoriums(): Auditorium[] {
    if (!this.auditoriums) return [];
    if (!this.filterCinemaId) return this.auditoriums;
    return this.auditoriums.filter(a => a.cinemaId === this.filterCinemaId);
  }

  loadAuditoriums(): void {
    this.auditoriums = null;
    this.adminService.getAuditoriums(this.filterCinemaId).subscribe({
      next: (data) => {
        this.auditoriums = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải phòng chiếu:', err);
        this.auditoriums = [];
      }
    });
  }

  onSelectAuditorium(aud: Auditorium): void {
    this.onSelect.emit(aud);
  }
}
