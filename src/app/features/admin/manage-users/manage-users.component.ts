import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { UserAdmin } from '../../../models/admin.model';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manage-container">
      <div class="header-actions">
        <h2>Quản lý Người Dùng</h2>
        <button class="btn btn-primary" (click)="openModal()">+ Thêm User</button>
      </div>

      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of paginatedUsers">
              <td>{{ user.id }}</td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phoneNumber || 'N/A' }}</td>
              <td>
                <span class="badge" [ngClass]="user.role === 'Admin' ? 'badge-danger' : 'badge-primary'">
                   {{ user.role }}
                </span>
              </td>
              <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>
                <ng-container *ngIf="user.role !== 'Admin' || user.id === authService.currentUser?.userId">
                  <button class="btn btn-edit" (click)="editUser(user)"><i class="fas fa-edit"></i> Sửa</button>
                  <button class="btn btn-delete" (click)="deleteUser(user.id)" *ngIf="user.id !== authService.currentUser?.userId"><i class="fas fa-trash"></i> Xóa</button>
                </ng-container>
                <ng-container *ngIf="user.role === 'Admin' && user.id !== authService.currentUser?.userId">
                  <span style="color: #95a5a6; font-size: 0.9em;">Không có quyền</span>
                </ng-container>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="7" class="text-center">Chưa có người dùng nào.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-wrapper" *ngIf="users.length > 0">
        <div class="pagination-container">
          <button class="btn btn-secondary btn-sm" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Trang trước</button>
          <button class="btn btn-sm" *ngFor="let p of pages" 
            [class.btn-primary]="p === currentPage" 
            [class.btn-secondary]="p !== currentPage" 
            (click)="changePage(p)">
            {{ p }}
          </button>
          <button class="btn btn-secondary btn-sm" [disabled]="currentPage === totalPages || totalPages === 0" (click)="changePage(currentPage + 1)">Trang sau</button>
        </div>
      </div>

      <!-- Modal Add/Edit -->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <h3>{{ editingUser ? 'Sửa thông tin' : 'Thêm' }} Người Dùng</h3>
          
          <div class="form-group">
            <label>Họ và tên <span style="color: #e74c3c">*</span></label>
            <input type="text" [(ngModel)]="currentUser.fullName" (ngModelChange)="validateField('fullName')" class="form-control" [class.is-invalid]="errors.fullName" />
            <small class="text-danger" *ngIf="errors.fullName">{{ errors.fullName }}</small>
          </div>
          
          <div class="form-group">
            <label>Email <span style="color: #e74c3c">*</span></label>
            <input type="email" [(ngModel)]="currentUser.email" (ngModelChange)="validateField('email')" class="form-control" [disabled]="editingUser" [class.is-invalid]="errors.email" />
            <small class="text-danger" *ngIf="errors.email">{{ errors.email }}</small>
            <small *ngIf="editingUser" style="color: #e74c3c; display: block; margin-top: 5px;">Bạn không thể sửa email. Vui lòng tạo tài khoản mới nếu cần đổi email.</small>
          </div>

          <div class="form-group">
            <label>{{ editingUser ? 'Mật khẩu mới (Bỏ trống nếu không đổi)' : 'Mật khẩu' }} <span *ngIf="!editingUser" style="color: #e74c3c">*</span></label>
            <input type="password" [(ngModel)]="currentUser.password" (ngModelChange)="validateField('password')" class="form-control" [class.is-invalid]="errors.password" />
            <small class="text-danger" *ngIf="errors.password">{{ errors.password }}</small>
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="text" [(ngModel)]="currentUser.phoneNumber" (ngModelChange)="validateField('phoneNumber')" class="form-control" [class.is-invalid]="errors.phoneNumber" />
            <small class="text-danger" *ngIf="errors.phoneNumber">{{ errors.phoneNumber }}</small>
          </div>

          <div class="form-group">
            <label>Vai trò</label>
            <select [(ngModel)]="currentUser.role" class="form-control">
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="closeModal()">Hủy</button>
            <button class="btn btn-primary" (click)="saveUser()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); color: #333; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header-actions h2 { margin: 0; color: #2c3e50; }
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: opacity 0.3s; }
    .btn:hover { opacity: 0.9; }
    .btn-primary { background: #3498db; color: #fff; }
    .btn-secondary { background: #95a5a6; color: #fff; }
    .btn-edit { background: #f39c12; color: #fff; margin-right: 5px; }
    .btn-delete { background: #e74c3c; color: #fff; }
    .admin-table { width: 100%; border-collapse: collapse; color: #333; }
    .admin-table th, .admin-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .admin-table th { background-color: #f8f9fa; color: #2c3e50; }
    .text-center { text-align: center; }
    .badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; color: #fff; }
    .badge-primary { background: #3498db; }
    .badge-danger { background: #e74c3c; }
    
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #fff; padding: 20px; border-radius: 8px; width: 450px; max-width: 90%; color: #333; }
    .modal-content h3 { margin-top: 0; color: #2c3e50; }
    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 500; color: #333; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; color: #333; background: #fff; }
    .form-control:disabled { background: #ecf0f1; cursor: not-allowed; }
    .text-danger { color: #e74c3c; font-size: 0.85em; display: inline-block; margin-top: 5px; }
    .is-invalid { border-color: #e74c3c !important; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class ManageUsersComponent implements OnInit {
  users: UserAdmin[] = [];
  showModal = false;
  editingUser = false;
  currentUser: Partial<UserAdmin> = {};
  errors: any = {};
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Managing users version: PAGINATED correctly! pageSize:', this.pageSize);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastService.error('Không thể tải danh sách người dùng. Vui lòng kiểm tra quyền truy cập.');
      }
    });
  }

  get paginatedUsers(): UserAdmin[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.users.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openModal(): void {
    this.editingUser = false;
    this.currentUser = { role: 'Customer' };
    this.errors = {};
    this.showModal = true;
  }

  editUser(user: UserAdmin): void {
    this.editingUser = true;
    this.currentUser = { ...user, password: '' };
    this.errors = {};
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.errors = {};
  }

  validateField(field: string): void {
    if (field === 'fullName') {
      if (!this.currentUser.fullName || this.currentUser.fullName.trim() === '') {
        this.errors.fullName = 'Họ tên không được để trống!';
      } else {
        delete this.errors.fullName;
      }
    }

    if (field === 'email') {
      if (!this.currentUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.currentUser.email)) {
        this.errors.email = 'Email không hợp lệ!';
      } else {
        delete this.errors.email;
      }
    }

    if (field === 'password') {
      if (!this.editingUser && (!this.currentUser.password || this.currentUser.password.length < 6)) {
        this.errors.password = 'Vui lòng nhập mật khẩu ít nhất 6 ký tự cho người dùng mới!';
      } else if (this.editingUser && this.currentUser.password && this.currentUser.password.length < 6) {
        this.errors.password = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
      } else {
        delete this.errors.password;
      }
    }

    if (field === 'phoneNumber') {
      if (this.currentUser.phoneNumber && this.currentUser.phoneNumber.trim() !== '') {
        if (!/^0\d{9,11}$/.test(this.currentUser.phoneNumber)) {
          this.errors.phoneNumber = 'Số điện thoại phải bắt đầu bằng 0 và có 10-12 chữ số!';
        } else {
          delete this.errors.phoneNumber;
        }
      } else {
        delete this.errors.phoneNumber;
      }
    }
  }

  saveUser(): void {
    this.validateField('fullName');
    this.validateField('email');
    this.validateField('password');
    this.validateField('phoneNumber');

    if (Object.keys(this.errors).length > 0) return;

    if (this.editingUser && this.currentUser.id) {
      this.adminService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          this.toastService.success('Cập nhật người dùng thành công!');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => this.toastService.error('Lỗi: ' + err.message)
      });
    } else {
      this.adminService.createUser(this.currentUser).subscribe({
        next: () => {
          this.toastService.success('Thêm người dùng thành công!');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => this.toastService.error('Lỗi: ' + (err.error?.message || err.message))
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này có thể không thực hiện được nếu user đã có bookings.')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.toastService.success('Xóa người dùng thành công!');
          this.loadUsers();
        },
        error: (err) => this.toastService.error('Lỗi khi xóa người dùng: ' + (err.error?.message || err.message))
      });
    }
  }
}
