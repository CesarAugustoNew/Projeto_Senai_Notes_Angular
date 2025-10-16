import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class LeftPanel implements OnInit {
  @Output() enviarTag = new EventEmitter<string | null>();
  @Output() listarSomenteArquivadas = new EventEmitter<boolean>();

  constructor(private cd: ChangeDetectorRef) {}

  tags: Tag[] = [];
  selectedTagName: string = "";

  async ngOnInit(): Promise<void> {
    await this.getTags();
  }

  private async getTags(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://senai-gpt-api.azurewebsites.net/senainotes/tags', {
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

