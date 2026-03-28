import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="brand">
          <h2 class="outfit">CINEMA<span class="accent">MAX</span></h2>
          <p>Trải nghiệm điện ảnh đỉnh cao với hệ thống rạp chiếu hiện đại nhất toàn quốc.</p>
          <div class="socials">
            <a href="#">Fb</a>
            <a href="#">Ig</a>
            <a href="#">Tw</a>
            <a href="#">Yt</a>
          </div>
        </div>
        <div class="links">
          <h4 class="outfit">Thông Tin</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Tuyển dụng</a></li>
          </ul>
        </div>
        <div class="links">
          <h4 class="outfit">Chế Độ</h4>
          <ul>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        <div class="newsletter">
          <h4 class="outfit">Đăng Ký Nhận Tin</h4>
          <div class="input-group">
            <input type="email" placeholder="Email của bạn">
            <button>➔</button>
          </div>
        </div>
      </div>
      <div class="bottom">
        <p>© 2026 CinemaMax. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--bg-secondary);
      padding: 4rem 0 2rem;
      border-top: 1px solid var(--glass-border);
    }
    .footer-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    .brand h2 { font-size: 1.8rem; margin-bottom: 1rem; }
    .brand p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    .accent { color: var(--accent-primary); }
    .socials { display: flex; gap: 1rem; }
    .socials a {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      font-size: 0.8rem;
    }
    .socials a:hover { background: var(--accent-primary); }
    h4 { margin-bottom: 1.5rem; font-size: 1.1rem; }
    ul li { margin-bottom: 0.8rem; }
    ul li a { color: var(--text-secondary); font-size: 0.9rem; }
    ul li a:hover { color: var(--text-primary); }
    .input-group {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      overflow: hidden;
    }
    input {
      background: transparent;
      border: none;
      padding: 0.8rem 1rem;
      color: white;
      flex: 1;
      outline: none;
    }
    .input-group button {
      background: var(--accent-primary);
      padding: 0 1rem;
      color: white;
    }
    .bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid var(--glass-border);
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
  `
})
export class Footer {}
