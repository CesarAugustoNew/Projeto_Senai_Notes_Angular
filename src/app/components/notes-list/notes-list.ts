import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface NoteItem {
  id: string | number;
  userId?: string | number;
  title: string;
  description?: string;
  tags: string[];
  image?: string;
  date: string;      // ISO
  archived?: boolean;
}

@Component({
  selector: 'notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.html',
  styleUrls: ['./notes-list.css']
})
export class NotesList implements OnInit, OnChanges {
  private readonly baseUrl = 'https://senai-gpt-api.azurewebsites.net/senainotes/notes';
  private rawNotes: NoteItem[] = [];

  @Input() tagSelecionada: string | null = null;
  @Input() somenteArquivadas = false;
  @Input() atualizarLista = 0;
  @Input() termoPesquisado = '';

  @Output() enviarNota = new EventEmitter<NoteItem>();

  notes: NoteItem[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const shouldReload =
      ('tagSelecionada' in changes && !changes['tagSelecionada'].firstChange) ||
      ('somenteArquivadas' in changes && !changes['somenteArquivadas'].firstChange) ||
      ('atualizarLista' in changes && !changes['atualizarLista'].firstChange);

    if (shouldReload) {
      this.getNotes();
      return;
    }

    if ('termoPesquisado' in changes && !changes['termoPesquisado'].firstChange) {
      this.applyFilters();
      this.cd.detectChanges();
    }
  }

  private buildHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  async getNotes(): Promise<void> {
    this.isLoading = true;

    try {
      const data = await firstValueFrom(
        this.http.get<NoteItem[]>(this.baseUrl, {
          headers: this.buildHeaders()
        })
      );

      this.rawNotes = Array.isArray(data) ? [...data] : [];
      this.applyFilters();
    } catch (err) {
      const message = err instanceof HttpErrorResponse && typeof err.error?.error === 'string'
        ? err.error.error
        : 'Nao foi possivel carregar as notas.';
      console.error('Erro ao buscar notas:', err);
      alert(message);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  private applyFilters(): void {
    let filtered = [...this.rawNotes];

    debugger;

    if (this.tagSelecionada) {
      filtered = filtered.filter(note =>
        Array.isArray(note.tags) &&
        note.tags.map(tag => String(tag?.toLowerCase()).trim()).includes(String(this.tagSelecionada?.toLowerCase()))
      );
    }

    if (this.somenteArquivadas) {
      filtered = filtered.filter(note => note.archived === true);
    }

    const term = (this.termoPesquisado ?? '').trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(note => {
        const title = (note.title ?? '').toLowerCase();
        const description = (note.description ?? '').toLowerCase();
        const tags = Array.isArray(note.tags)
          ? note.tags.map(tag => String(tag).toLowerCase())
          : [];

        return (
          title.includes(term) ||
          description.includes(term) ||
          tags.some(tag => tag.includes(term))
        );
      });
    }

    this.notes = filtered;
  }

  async onCreateNote(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      await firstValueFrom(
        this.http.post<NoteItem>(this.baseUrl, {
          userId: localStorage.getItem('userId') ?? '1',
          title: 'Nova anotacao',
          description: 'Escreva aqui sua descricao',
          tags: [],
          image: 'assets/sample.png',
          date: new Date().toISOString(),
          archived: false
        }, {
          headers: this.buildHeaders()
        })
      );

      alert('Anotacao criada com sucesso!');
      await this.getNotes();
    } catch (err) {
      const message = err instanceof HttpErrorResponse && typeof err.error?.error === 'string'
        ? err.error.error
        : 'Erro ao criar uma nota, tente novamente.';
      console.error('Erro ao criar nota:', err);
      alert(message);
    } finally {
      this.isLoading = false;
    }
  }

  onSelect(note: NoteItem): void {
    this.enviarNota.emit(note);
  }
}
