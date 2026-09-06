import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface Tag {
  id: number | string;
  name: string;
}

@Component({
  selector: 'left-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-panel.html',
  styleUrls: ['./left-panel.css']
})
export class LeftPanel implements OnInit, OnChanges {
  @Input() atualizarLista = 0;
  @Output() enviarTag = new EventEmitter<string | null>();
  @Output() listarSomenteArquivadas = new EventEmitter<boolean>();

  constructor(private cd: ChangeDetectorRef) {}

  tags: Tag[] = [];
  selectedTagName: string = "";

  async ngOnInit(): Promise<void> {
    await this.getTags();
  }

  // Antes as etiquetas só eram buscadas uma vez, quando a tela abria.
  // Criar uma nota nova com uma etiqueta inédita (ou editar uma nota
  // pra usar uma etiqueta que ainda não existia) nunca fazia essa
  // lista recarregar, então a etiqueta nunca aparecia aqui do lado,
  // mesmo já estando salva de verdade na nota. Agora, sempre que
  // atualizarLista mudar (o mesmo sinal que a lista de notas usa pra
  // saber quando recarregar), a lista de etiquetas recarrega junto.
  ngOnChanges(changes: SimpleChanges): void {
    if ('atualizarLista' in changes && !changes['atualizarLista'].firstChange) {
      this.getTags();
    }
  }

  private async getTags(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${environment.apiUrl}/senainotes/tags`, {
        headers
      });
      const data = (await response.json()) as Tag[];
      this.tags = Array.isArray(data) ? data : [];
    } catch {
      this.tags = [];
    }

    this.cd.detectChanges();
  }

  aoListarTodasAsNotas(): void {
    this.enviarTag.emit(null);
    this.listarSomenteArquivadas.emit(false);
  }

  aoListarArquivadas(): void {
    this.listarSomenteArquivadas.emit(true);
  }

  aoFiltrarPorTag(tagName: string): void {
    
    if (tagName == this.selectedTagName) {

      this.enviarTag.emit(null);

    } else {
      
      this.enviarTag.emit(tagName);
      this.selectedTagName = tagName;

    }

  }
}
