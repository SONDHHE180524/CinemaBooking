import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="movies-section container">
      <div class="section-header">
        <h2 class="outfit">Phim Đang Chiếu</h2>
        <a href="#" class="view-all">Xem tất cả ➔</a>
      </div>
      
      <div class="movie-grid">
        <div class="movie-card" *ngFor="let movie of mockMovies">
          <div class="poster-container">
            <img [src]="movie.poster" [alt]="movie.title">
            <div class="card-overlay glass">
              <button class="btn-book outfit">Đặt Vé</button>
            </div>
          </div>
          <div class="info">
            <h3 class="outfit">{{ movie.title }}</h3>
            <div class="meta">
              <span class="rating">⭐ {{ movie.rating }}</span>
              <span class="dot">•</span>
              <span class="genre">{{ movie.genre }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .movies-section {
      padding: 4rem 0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .section-header h2 {
      font-size: 2rem;
    }
    .view-all {
      color: var(--accent-primary);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }
    .movie-card {
      transition: var(--transition-smooth);
    }
    .poster-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 2/3;
      margin-bottom: 1rem;
    }
    .poster-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--transition-smooth);
    }
    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: var(--transition-smooth);
    }
    .movie-card:hover .poster-container img {
      transform: scale(1.1);
    }
    .movie-card:hover .card-overlay {
      opacity: 1;
    }
    .btn-book {
      background: var(--accent-primary);
      color: white;
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      transform: translateY(20px);
      transition: var(--transition-smooth);
    }
    .movie-card:hover .btn-book {
      transform: translateY(0);
    }
    .info h3 {
      font-size: 1.1rem;
      margin-bottom: 0.4rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    .rating {
      color: #ffc107;
      font-weight: 600;
    }
  `
})
export class MovieList {
  mockMovies = [
    { title: 'John Wick: Chapter 4', rating: '8.5', genre: 'Hành Động', poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=500' },
    { title: 'Oppenheimer', rating: '8.8', genre: 'Tiểu Sử, Chính Kịch', poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500' },
    { title: 'Dune: Part Two', rating: '9.0', genre: 'Khoa Học Viễn Tưởng', poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=500' },
    { title: 'Avatar: The Way of Water', rating: '7.8', genre: 'Hành Động, Viễn Tưởng', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500' },
    { title: 'Interstellar', rating: '8.9', genre: 'Khoa Học Viễn Tưởng', poster: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=500' }
  ];
}
