import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  isEditing = false;
  loading = true;
  saving = false;
  message: { type: 'success' | 'error'; text: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    const current = this.authService.currentUser;
    if (current) {
      this.user = {
        id: current.userId,
        fullName: current.fullName,
        email: current.email,
        role: current.role,
        createdAt: new Date()
      } as User;
      this.profileForm.patchValue({
        fullName: current.fullName,
        email: current.email
      });
      this.loading = false;
    }
    this.loadProfile();
  }

  loadProfile(): void {
    if (!this.user) {
      this.loading = true;
    }
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber ?? ''
        });
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.message = { type: 'error', text: 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.' };
        }
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Huỷ chỉnh sửa → reset form
      this.profileForm.patchValue({
        fullName: this.user?.fullName ?? '',
        phoneNumber: this.user?.phoneNumber ?? ''
      });
      this.message = null;
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.user) return;

    this.message = null;

    const payload = {
      fullName: this.profileForm.value.fullName?.trim() || '',
      phoneNumber: this.profileForm.value.phoneNumber?.trim() || null
    };

    // Lưu trạng thái cũ để rollback nếu lỗi
    const previousUser = { ...this.user };

    // Cập nhật giao diện lập tức (Optimistic Update)
    this.user.fullName = payload.fullName;
    this.user.phoneNumber = payload.phoneNumber;
    this.isEditing = false;
    this.message = { type: 'success', text: 'sửa profile thành công' };
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.authService.updateProfile(payload).subscribe({
      next: (res) => {
        const updated: User = res.profile ?? res;
        this.user = updated;
        this.profileForm.patchValue({
          fullName: updated.fullName,
          phoneNumber: updated.phoneNumber ?? ''
        });
        this.notificationService.fetchNotifications().subscribe();
        setTimeout(() => (this.message = null), 3000);
      },
      error: (err) => {
        // Rollback lại form nếu có lỗi
        this.user = previousUser;
        this.profileForm.patchValue({
          fullName: previousUser.fullName,
          phoneNumber: previousUser.phoneNumber ?? ''
        });
        this.isEditing = true;
        this.message = {
          type: 'error',
          text: err?.error?.message || err?.error || 'Cập nhật thất bại. Vui lòng thử lại.'
        };
      }
    });
  }
}
