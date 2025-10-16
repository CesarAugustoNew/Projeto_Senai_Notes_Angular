import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface NoteModel {
  id: string | number;
  userId?: string | number;
  title: string;
  description?: string;
  tags: string[];
  image?: string;
  date: string;        // ISO
  archived?: boolean;
}

@Component({
  selector: 'note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note.html',
  styleUrls: ['./note.css']
})
export class Note implements OnChanges {

  @Input() notaSelecionada: any | null = null;
  @Output() aoFecharANota = new EventEmitter<void>();

  // Estados editáveis
  title = '';
  tags = '';
  description = '';
  imageFile: File | null = null;
  imageURL = '';

  ngOnChanges(changes: SimpleChanges): void {
    if ('notaSelecionada' in changes) {
      const n = this.notaSelecionada;
      if (n) {
        this.title = n.title ?? '';
        this.tags = Array.isArray(n.tags) ? n.tags.join(', ') : '';
        this.description = n.description ?? '';
        // zera preview caso troque de nota
        this.imageFile = null;
        this.imageURL = '';
      } else {
        // limpando campos quando não há nota
        this.title = '';
        this.tags = '';
        this.description = '';
        this.imageFile = null;
        this.imageURL = '';
      }
    }
  }

  async onSaveNote(): Promise<void> {
    if (!this.notaSelecionada) return;

    // Mantendo a mesma lógica do React: salva imagem "temporária" fixa
    const payload: NoteModel = {
      ...this.notaSelecionada,
      title: this.title,
      description: this.description,
      tags: this.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: 'assets/sample.png',
      date: new Date().toISOString()
    };

    try {
      const toastId = this.loadingToast('Salvando a nota...');
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`https://senai-gpt-api.azurewebsites.net/senainotes/notes/${this.notaSelecionada.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.updateToast(toastId, 'Nota salva com sucesso!', true);
        this.imageFile = null;
        this.imageURL = '';
        this.aoFecharANota.emit();
      } else {
        this.updateToast(toastId, 'Erro ao salvar a nota.', false);
      }
    } catch (err) {
      console.error('Erro ao salvar a nota:', err);
      alert('Erro de rede ao salvar a nota.');
    }
  }

  aoDefinirAImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      alert('É necessário selecionar uma imagem.');
      return;
    }
    const file = input.files[0];
    this.imageFile = file;
    this.imageURL = URL.createObjectURL(file);
  }

  // Helpers simples para “toasts” sem libs externas
  private loadingToast(msg: string): number {
    console.log('[toast:loading]', msg);
    // Apenas simulando um id
    return Date.now();
  }

  private updateToast(id: number, msg: string, success: boolean): void {
    console.log(`[toast:update:${id}]`, success ? 'success' : 'error', msg);
    alert(msg);
  }
}

