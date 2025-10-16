import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrls: ['./login-screen.css']
})
export class LoginScreen {
  form: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  async onLoginClick(): Promise<void> {
    if (!this.form.valid) {
      window.alert('Preencha os campos corretamente.');
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    const email = String(this.email?.value || '');
    const password = String(this.password?.value || '');

    this.isSubmitting = true;

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>('https://senai-gpt-api.azurewebsites.net/login', { email, password })
      );

      window.alert('Login realizado com sucesso!');

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
      const httpError = error as HttpErrorResponse;
      const message = typeof httpError?.error?.error === 'string'
        ? httpError.error.error
        : 'Falha ao realizar login.';
      window.alert(message);
    } finally {
      this.isSubmitting = false;
    }
  }
}