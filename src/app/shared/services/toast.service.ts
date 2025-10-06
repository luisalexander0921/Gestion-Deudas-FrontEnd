import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addToast(message: string, type: Toast['type'], duration: number = 3000): void {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, duration);
  }

  success(message: string, duration?: number): void {
    this.addToast(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.addToast(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.addToast(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.addToast(message, 'info', duration);
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }
}