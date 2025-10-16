import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from "../components/header/header";
import { LeftPanel } from "../components/left-panel/left-panel";
import { NotesList } from "../components/notes-list/notes-list";
import { Note } from "../components/note/note";
import { NoteOptions } from "../components/note-options/note-options";

export interface NoteModel {
  id: string | number;
  title: string;
  content: string;
  tags: string[];
  archived: boolean;
  // adicione outros campos que sua API usar
}

@Component({
  selector: 'app-notes-screen',
  standalone: true,
  imports: [CommonModule, Header, LeftPanel, NotesList, Note, NoteOptions],
  templateUrl: './notes-screen.html',
  styleUrls: ['./notes-screen.css'],
})
export class NotesScreen {
  tag: string = '';
  termoPesquisado: string = '';
  nota: NoteModel | null = null;
  somenteArquivadas: boolean = false;
  atualizarLista = 0;

  // callbacks que espelham as props do React
  onEnviarTag(tag: any) {
    this.tag = tag ?? '';
  }

  onListarSomenteArquivadas(arquivadas: any) {
    this.somenteArquivadas = !!arquivadas;
  }

  onEnviarNota(nota: any | null) {
    this.nota = nota;
  }

  onFecharNota() {
    this.nota = null;
    this.atualizarLista = this.atualizarLista + 1; // forca recarga na lista
  }
}
