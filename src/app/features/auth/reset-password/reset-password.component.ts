import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: '../login/login.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  error = '';
  successMsg = '';
  prefillEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.prefillEmail = email;
      this.resetForm.patchValue({ email });
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const pw = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMsg = '';

    this.authService.resetPassword(this.resetForm.value).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Đặt lại mật khẩu thành công! Đang chuyển về đăng nhập...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { email: this.resetForm.value.email },
            state: { email: this.resetForm.value.email, password: this.resetForm.value.newPassword }
          });
        }, 2000);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error || 'Mã OTP không hợp lệ hoặc đã hết hạn.';
        this.loading = false;
      }
    });
  }
}
