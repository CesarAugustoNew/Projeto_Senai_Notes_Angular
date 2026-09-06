import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

/*
  Substitui os alert()/window.alert() espalhados pelo projeto por uma
  notificação visual "toast" (aparece no canto da tela e some sozinha),
  sem travar a interação do usuário como o alert() nativo do navegador.
*/
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<ToastItem[]>([]);

  success(message: string, durationMs = 3500): void {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs = 4500): void {
    this.show(message, 'error', durationMs);
  }

  info(message: string, durationMs = 3500): void {
    this.show(message, 'info', durationMs);
  }

  /** Mostra um toast "carregando..." que fica até resolve()/reject() serem chamados. */
  loading(message: string): number {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, message, type: 'loading' }]);
    return id;
  }

  resolve(id: number, message: string, durationMs = 3500): void {
    this.replace(id, message, 'success', durationMs);
  }

  reject(id: number, message: string, durationMs = 4500): void {
    this.replace(id, message, 'error', durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private show(message: string, type: ToastType, durationMs: number): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  private replace(id: number, message: string, type: ToastType, durationMs: number): void {
    this.toasts.update(list => list.map(t => (t.id === id ? { ...t, message, type } : t)));
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
