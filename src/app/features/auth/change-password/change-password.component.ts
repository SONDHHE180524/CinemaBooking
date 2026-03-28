import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: '../login/login.component.css'
})
export class ChangePasswordComponent {
  changeForm: FormGroup;
  loading = false;
  error = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const pw = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMsg = '';

    this.authService.changePassword(this.changeForm.value).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.';
        this.loading = false;
        this.changeForm.reset();
        // Logout sau 2 giây vì mật khẩu đã thay đổi
        const currentEmail = this.authService.currentUser?.email;
        const newPassword = this.changeForm.value.newPassword;
        setTimeout(() => {
          this.authService.logout({ state: { email: currentEmail, password: newPassword } });
        }, 2500);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error || 'Mật khẩu hiện tại không đúng hoặc có lỗi.';
        this.loading = false;
      }
    });
  }
}
