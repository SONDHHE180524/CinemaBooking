import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()" 
           class="toast animate-slide-in" 
           [ngClass]="toast.type"
           (click)="remove(toast.id)">
        <span class="icon">{{ getIcon(toast.type) }}</span>
        <span class="message">{{ toast.message }}</span>
        <button class="close-btn">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      min-width: 300px;
      max-width: 450px;
      padding: 15px 20px;
      border-radius: 12px;
      background: rgba(30, 30, 30, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      border-left: 5px solid transparent;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .toast.success { border-left-color: #2ecc71; }
    .toast.error { border-left-color: #e74c3c; }
    .toast.info { border-left-color: #3498db; }
    .toast.warning { border-left-color: #f1c40f; }

    .icon { font-size: 1.2rem; }
    .message { flex: 1; font-weight: 500; font-size: 0.95rem; }
    .close-btn { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.2rem; cursor: pointer; }
    .close-btn:hover { color: white; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
  public toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
