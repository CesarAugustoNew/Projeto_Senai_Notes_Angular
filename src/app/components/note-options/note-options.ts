import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../toast/toast.service';

export interface NoteModel {
  id: string | number;
  title: string;
  archived?: boolean;
}

@Component({
  selector: 'note-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-options.html',
  styleUrls: ['./note-options.css']
})
export class NoteOptions {
  @Input() notaSelecionada!: NoteModel;
  @Output() aoFecharANota = new EventEmitter<void>();

  private readonly baseUrl = `${environment.apiUrl}/senainotes/notes`;

  constructor(private toast: ToastService) {}

  private buildHeaders(includeJson = false): Record<string, string> {
    const headers: Record<string, string> = includeJson ? { 'Content-Type': 'application/json' } : {};
    const token = localStorage.getItem('token');

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async onArchiveNote(): Promise<void> {
    if (!this.notaSelecionada) return;
    const res = await fetch(`${this.baseUrl}/${this.notaSelecionada.id}`, {
      method: 'PATCH',
      headers: this.buildHeaders(true),
      body: JSON.stringify({ archived: true })
    });

    if (!res.ok) {
      this.toast.error('Erro ao arquivar a nota');
    } else {
      this.toast.success(`Nota "${this.notaSelecionada.title}" arquivada!`);
    }

    this.aoFecharANota.emit();
  }

  async onUnarchiveNote(): Promise<void> {
    if (!this.notaSelecionada) return;
    const res = await fetch(`${this.baseUrl}/${this.notaSelecionada.id}`, {
      method: 'PATCH',
      headers: this.buildHeaders(true),
      body: JSON.stringify({ archived: false })
    });

    if (!res.ok) {
      this.toast.error('Erro ao desarquivar a nota');
    } else {
      this.toast.success(`Nota "${this.notaSelecionada.title}" desarquivada!`);
    }

    this.aoFecharANota.emit();
  }

  async onDeleteNote(): Promise<void> {
    if (!this.notaSelecionada) return;
    const res = await fetch(`${this.baseUrl}/${this.notaSelecionada.id}`, {
      method: 'DELETE',
      headers: this.buildHeaders()
    });

    if (!res.ok) {
      this.toast.error('Erro ao deletar a nota');
    } else {
      this.toast.success(`Nota "${this.notaSelecionada.title}" deletada!`);
    }

    this.aoFecharANota.emit();
  }
}
