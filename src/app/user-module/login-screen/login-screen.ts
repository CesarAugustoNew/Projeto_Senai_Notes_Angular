import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../toast/toast.service';

interface LoginResponse {
  accessToken?: string;
  user?: {
    id?: string
  };
  [key: string]: unknown;
}

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ThemeToggle],
  templateUrl: './login-screen.html',
  styleUrls: ['./login-screen.css']
})
export class LoginScreen {
  form: FormGroup;

  // Signal em vez de propriedade comum: o app usa
  // provideZonelessChangeDetection(), então uma mudança de estado
  // feita depois de um `await` (fora de um evento do template) só
  // atualiza a tela de forma confiável se passar por um signal.
  // Antes disso o botão podia continuar com aparência de "carregando"
  // (ou nada parecer acontecer) mesmo depois da resposta chegar.
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  async onLoginClick(): Promise<void> {
    if (!this.form.valid) {
      this.toast.error('Preencha os campos corretamente.');
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    const email = String(this.email?.value || '');
    const password = String(this.password?.value || '');

    this.isSubmitting.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiUrl}/login`, { email, password })
          // Sem timeout, se a API demorar (ex.: "acordando" de um plano
          // gratuito que hiberna quando fica sem uso) a tela ficava
          // travada indefinidamente, parecendo que "não vai".
          .pipe(timeout(20000))
      );

      this.toast.success('Login realizado com sucesso!');

      const token = typeof response?.accessToken === 'string' ? response.accessToken : undefined;
      const userId = typeof response?.user?.id === 'string' ? response.user.id: undefined;

      if (token) {
        localStorage.setItem('token', token);
      }

      if (userId) {
        localStorage.setItem('userId', userId);
      }

      this.router.navigateByUrl('/notes');
    } catch (error) {
      let message = 'Falha ao realizar login.';

      if ((error as { name?: string })?.name === 'TimeoutError') {
        message = 'O servidor demorou demais para responder. Ele pode estar "acordando" — aguarde alguns segundos e tente novamente.';
      } else {
        const httpError = error as HttpErrorResponse;
        if (typeof httpError?.error?.error === 'string') {
          message = httpError.error.error;
        }
      }

      this.toast.error(message);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
