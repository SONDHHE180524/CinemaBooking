import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionTimerService {
  private inactivityTimeout = 1 * 60 * 1000; // 1 phút (để test)
  private eventSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone
  ) { }

  startMonitoring(): void {
    this.stopMonitoring();

    // Chạy ngoài Angular zone để tránh trigger Change Detection liên tục
    this.ngZone.runOutsideAngular(() => {
      const eventStreams = [
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'scroll'),
        fromEvent(document, 'touchstart')
      ];

      this.eventSubscription = merge(...eventStreams)
        .pipe(
          // Reset timer mỗi khi có event
          switchMap(() => timer(this.inactivityTimeout))
        )
        .subscribe(() => {
          // Khi hết thời gian, quay lại Angular zone để logout
          this.ngZone.run(() => {
            if (this.authService.isAuthenticated) {
              this.authService.logout({ queryParams: { expired: true, inactive: true } });
            }
          });
        });
    });
  }

  stopMonitoring(): void {
    this.eventSubscription?.unsubscribe();
  }
}
