import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from './shared/components/layout/header/header';
import { Footer } from './shared/components/layout/footer/footer';
import { ToastComponent } from './shared/components/layout/toast/toast.component';
import { SessionTimerService } from './core/services/session-timer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, ToastComponent],
  template: `
    <app-header *ngIf="!isAdminRoute()"></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-toast></app-toast>
    <app-footer *ngIf="!isAdminRoute()"></app-footer>
  `,
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'CinemaMax';
  private router = inject(Router);
  private sessionTimer = inject(SessionTimerService);

  ngOnInit(): void {
    this.sessionTimer.startMonitoring();
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
