import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { environment } from '../../../environments/environment';

interface CreateUserResponse {
  [key: string]: unknown;
}

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ThemeToggle],
  templateUrl: './new-user-screen.html',
  styleUrls: ['./new-user-screen.css']
})
export class NewUserScreen {
  form: FormGroup;

  // Signal pelo mesmo motivo do login: garante que a UI (botão)
  // reflita corretamente o estado depois de um `await`, mesmo com
  // provideZonelessChangeDetection() habilitado no app.
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  async onSignUpClick(): Promise<void> {
    if (!this.form.valid) {
      window.alert('Preencha os campos corretamente.');
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    const name = String(this.name?.value || '');
    const email = String(this.email?.value || '');
    const password = String(this.password?.value || '');

    this.isSubmitting.set(true);

    try {
      await firstValueFrom(
        this.http.post<CreateUserResponse>(`${environment.apiUrl}/users`, { name, email, password })
          .pipe(timeout(20000))
      );

      window.alert('Usuario cadastrado com sucesso!');
      this.router.navigateByUrl('/login');
    } catch (error) {
      let message = 'Erro ao cadastrar o usuario, tente novamente.';

      if ((error as { name?: string })?.name === 'TimeoutError') {
        message = 'O servidor demorou demais para responder. Ele pode estar "acordando" — aguarde alguns segundos e tente novamente.';
      } else {
        const httpError = error as HttpErrorResponse;
        if (typeof httpError?.error?.error === 'string') {
          message = httpError.error.error;
        }
      }

      window.alert(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
