import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section class="hero">
      <div class="overlay"></div>
      <div class="container hero-content">
        <div class="badge outfit">PHIM HOT TRONG TUẦN</div>
        <h1 class="title outfit">Spider-Man: <br><span class="gradient-text">Across the Spider-Verse</span></h1>
        <p class="description">Miles Morales lạc bước qua đa vũ trụ, nơi anh gặp gỡ một nhóm Người Nhện chịu trách nhiệm bảo vệ sự tồn vong của các thực tại.</p>
        <div class="meta">
          <span>2024</span> • <span>Hành động, Hoạt hình</span> • <span>2h 20m</span>
        </div>
        <div class="hero-btns">
          <button class="btn btn-primary outfit">Đặt Vé Ngay</button>
          <button class="btn btn-secondary outfit">Xem Trailer</button>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      height: 90vh;
      min-height: 600px;
      background-image: linear-gradient(to right, rgba(10, 10, 12, 0.9) 20%, rgba(10, 10, 12, 0.2) 100%), 
                        url('https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=2000');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      padding-top: 80px;
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 700px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: var(--accent-primary);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 1.5rem;
    }
    .title {
      font-size: 4.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      font-weight: 800;
    }
    .description {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-bottom: 2rem;
      max-width: 500px;
    }
    .meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .hero-btns {
      display: flex;
      gap: 1.5rem;
    }
    .btn {
      padding: 0.8rem 2.5rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 1rem;
    }
    .btn-primary {
      background: var(--accent-primary);
      color: white;
      box-shadow: 0 4px 15px var(--accent-glow);
    }
    .btn-primary:hover {
      box-shadow: 0 8px 25px var(--accent-glow);
      transform: translateY(-3px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }
  `
})
export class Hero { }
