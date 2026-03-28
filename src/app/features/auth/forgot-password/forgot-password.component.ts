import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: '../login/login.component.css'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  error = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMsg = '';

    this.authService.forgotPassword(this.forgotForm.value).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Mã OTP đã được gửi đến email của bạn.';
        this.loading = false;
        // Chuyển sang trang reset-password và truyền email qua query params
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email: this.forgotForm.value.email }
          });
        }, 2000);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error || 'Có lỗi xảy ra. Vui lòng thử lại.';
        this.loading = false;
      }
    });
  }
}
