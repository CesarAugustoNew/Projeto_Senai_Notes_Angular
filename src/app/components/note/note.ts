import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../toast/toast.service';

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

  constructor(private toast: ToastService) {}

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

    // Bug corrigido: antes, o campo "image" era sempre gravado como
    // 'assets/sample.png' fixo, não importa qual foto o usuário
    // escolhesse no input de arquivo. Agora, se uma nova imagem foi
    // selecionada, ela é convertida para uma Data URL (base64) e
    // essa é a imagem enviada; caso contrário, mantém a imagem que a
    // nota já tinha.
    const imagem = this.imageFile
      ? await this.fileParaDataUrl(this.imageFile)
      : (this.notaSelecionada.image ?? '');

    const payload: NoteModel = {
      ...this.notaSelecionada,
      title: this.title,
      description: this.description,
      tags: this.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: imagem,
      date: new Date().toISOString()
    };

    const toastId = this.toast.loading('Salvando a nota...');

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${environment.apiUrl}/senainotes/notes/${this.notaSelecionada.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.toast.resolve(toastId, 'Nota salva com sucesso!');
        this.imageFile = null;
        this.imageURL = '';
        this.aoFecharANota.emit();
      } else {
        this.toast.reject(toastId, 'Erro ao salvar a nota.');
      }
    } catch (err) {
      console.error('Erro ao salvar a nota:', err);
      this.toast.reject(toastId, 'Erro de rede ao salvar a nota.');
    }
  }

  aoDefinirAImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      this.toast.error('É necessário selecionar uma imagem.');
      return;
    }
    const file = input.files[0];
    this.imageFile = file;
    this.imageURL = URL.createObjectURL(file);
  }

  // Converte o arquivo escolhido em uma Data URL (base64) para poder
  // enviá-lo dentro do JSON da nota (a API espera "image" como string).
  private fileParaDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
