import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  isDropdownVisible = false;
  @Input() somenteArquivadas: boolean = false;
  @Input() tag: string = '';
  @Input() termoPesquisado: string = '';
  @Output() termoPesquisadoChange = new EventEmitter<string>();

  // Funcao de logout: limpa o localStorage e redireciona
  onLogoutClick(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  showDropdown(): void {
    this.isDropdownVisible = true;
  }

  hideDropdown(): void {
    this.isDropdownVisible = false;
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.termoPesquisado = value;
    this.termoPesquisadoChange.emit(value);
  }
}

