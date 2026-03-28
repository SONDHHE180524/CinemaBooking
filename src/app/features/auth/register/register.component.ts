import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: '../login/login.component.css' // Dùng chung style với login
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['']
    });
  }

  successMsg: string = '';

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      this.successMsg = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMsg = 'Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...';
          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { email: this.registerForm.value.email } });
          }, 1500);
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          let errorMessage = 'Có lỗi xảy ra khi đăng ký';

          // Trích xuất thông báo lỗi nếu API trả về một object
          if (err.error) {
            if (typeof err.error === 'string') {
              errorMessage = err.error;
            } else if (err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error.title) {
              errorMessage = err.error.title;
            } else if (err.error.errors) {
              // Extract field-specific validation errors from .NET Core
              const errorMessages = Object.values(err.error.errors).flat();
              if (errorMessages.length > 0) {
                errorMessage = errorMessages[0] as string;
              }
            }
          } else if (err.message) {
            errorMessage = err.message;
          }

          this.error = errorMessage;
          this.loading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
