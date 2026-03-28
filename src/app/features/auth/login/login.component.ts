import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  successMsg: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const state = history.state;
    if (state && (state.email || state.password)) {
      this.loginForm.patchValue({
        email: state.email || '',
        password: state.password || ''
      });
    }

    const emailParam = this.route.snapshot.queryParamMap.get('email');
    if (emailParam && (!state || !state.email)) {
      this.loginForm.patchValue({ email: emailParam });
    }

    // Handle session messages
    const expired = this.route.snapshot.queryParamMap.get('expired');
    const inactive = this.route.snapshot.queryParamMap.get('inactive');
    
    if (expired) {
      if (inactive) {
        this.error = 'Phiên làm việc đã kết thúc do bạn không hoạt động quá lâu.';
      } else {
        this.error = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      this.successMsg = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'Email hoặc mật khẩu không chính xác';
          this.loading = false;
        }
      });
    }
  }
}
