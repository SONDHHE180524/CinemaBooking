import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Movie } from '../../../models/admin.model';

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-container">
      <div class="header-actions">
        <h2>Quản lý Phim</h2>
        <button class="btn btn-primary" (click)="openModal()">+ Thêm Phim</button>
      </div>

      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Poster</th>
              <th>Tên Phim</th>
              <th>Đạo Diễn</th>
              <th>Thời Lượng</th>
              <th>Ngày Chiếu</th>
              <th>Trạng Thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movie of movies">
              <td>{{ movie.id }}</td>
              <td>
                <img [src]="movie.posterUrl || 'assets/placeholder.jpg'" alt="poster" width="50" style="border-radius:4px" />
              </td>
              <td>{{ movie.title }}</td>
              <td>{{ movie.director || 'N/A' }}</td>
              <td>{{ movie.durationMinutes }} phút</td>
              <td>{{ movie.releaseDate }}</td>
              <td>
                <span class="badge" [ngClass]="movie.status === 'Showing' ? 'badge-success' : 'badge-warning'">
                  {{ movie.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-edit" (click)="editMovie(movie)"><i class="fas fa-edit"></i> Sửa</button>
                <button class="btn btn-delete" (click)="deleteMovie(movie.id)"><i class="fas fa-trash"></i> Xóa</button>
              </td>
            </tr>
            <tr *ngIf="movies.length === 0">
              <td colspan="8" class="text-center">Chưa có phim nào.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Add/Edit -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content large-modal">
          <h3>{{ editingMovie ? 'Sửa' : 'Thêm' }} Phim</h3>
          
          <div class="form-group">
            <label>Tên phim</label>
            <input type="text" [(ngModel)]="currentMovie.title" class="form-control" placeholder="Nhập tên phim" />
          </div>
          
          <div class="form-group">
            <label>Mô tả</label>
            <textarea [(ngModel)]="currentMovie.description" class="form-control" rows="3" placeholder="Nhập mô tả phim"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label>Đạo diễn</label>
              <input type="text" [(ngModel)]="currentMovie.director" class="form-control" />
            </div>
            <div class="form-group col">
              <label>Thời lượng (phút)</label>
              <input type="number" [(ngModel)]="currentMovie.durationMinutes" class="form-control" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label>Ngày chiếu</label>
              <input type="date" [(ngModel)]="currentMovie.releaseDate" class="form-control" />
            </div>
            <div class="form-group col">
              <label>Trạng thái</label>
              <select [(ngModel)]="currentMovie.status" class="form-control">
                <option value="Upcoming">Sắp chiếu</option>
                <option value="Showing">Đang chiếu</option>
                <option value="Ended">Đã kết thúc</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label>Link Poster</label>
              <input type="text" [(ngModel)]="currentMovie.posterUrl" class="form-control" />
            </div>
            <div class="form-group col">
              <label>Link Trailer</label>
              <input type="text" [(ngModel)]="currentMovie.trailerUrl" class="form-control" />
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveMovie()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header-actions h2 { margin: 0; color: #2c3e50; }
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: opacity 0.3s; }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background: #3498db; color: #fff; }
    .btn-secondary { background: #95a5a6; color: #fff; }
    .btn-edit { background: #f39c12; color: #fff; margin-right: 5px; }
    .btn-delete { background: #e74c3c; color: #fff; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: middle; }
    .admin-table th { background-color: #f8f9fa; color: #2c3e50; }
    .text-center { text-align: center; }
    .badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; color: #fff; }
    .badge-success { background: #2ecc71; }
    .badge-warning { background: #f39c12; }
    
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #fff; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%; max-height: 90vh; overflow-y: auto;}
    .large-modal { width: 650px; }
    .modal-content h3 { margin-top: 0; }
    .form-group { margin-bottom: 15px; }
    .form-row { display: flex; gap: 15px; }
    .form-row .col { flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    textarea.form-control { resize: vertical; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ManageMoviesComponent implements OnInit {
  movies: Movie[] = [];
  showModal = false;
  editingMovie = false;
  currentMovie: Partial<Movie> = {};

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.adminService.getMovies().subscribe(data => this.movies = data);
  }

  openModal(): void {
    this.editingMovie = false;
    this.currentMovie = { durationMinutes: 120, status: 'Upcoming' };
    this.showModal = true;
  }

  editMovie(movie: Movie): void {
    this.editingMovie = true;
    this.currentMovie = { ...movie };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveMovie(): void {
    if (!this.currentMovie.title) {
      alert('Vui lòng nhập tên phim!');
      return;
    }

    if (this.currentMovie.releaseDate) {
        // Format date string to match API requirement if needed...
    }

    if (this.editingMovie && this.currentMovie.id) {
      this.adminService.updateMovie(this.currentMovie.id, this.currentMovie).subscribe({
        next: () => { this.loadMovies(); this.closeModal(); },
        error: (err) => alert('Lỗi: ' + err.message)
      });
    } else {
      this.adminService.createMovie(this.currentMovie).subscribe({
        next: () => { this.loadMovies(); this.closeModal(); },
        error: (err) => alert('Lỗi: ' + err.message)
      });
    }
  }

  deleteMovie(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      this.adminService.deleteMovie(id).subscribe({
        next: () => this.loadMovies(),
        error: (err) => alert('Không thể xóa. Phim này đã có lịch chiếu.')
      });
    }
  }
}
