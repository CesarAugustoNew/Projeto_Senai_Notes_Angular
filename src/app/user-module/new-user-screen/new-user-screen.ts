import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface CreateUserResponse {
  [key: string]: unknown;
}

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-user-screen.html',
  styleUrls: ['./new-user-screen.css']
})
export class NewUserScreen {
  form: FormGroup;
  isSubmitting = false;

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

    if (this.isSubmitting) {
      return;
    }

    const name = String(this.name?.value || '');
    const email = String(this.email?.value || '');
    const password = String(this.password?.value || '');

    this.isSubmitting = true;

    try {
      await firstValueFrom(
        this.http.post<CreateUserResponse>('https://senai-gpt-api.azurewebsites.net/users', { name, email, password })
      );

      window.alert('Usuario cadastrado com sucesso!');
      this.router.navigateByUrl('/login');
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      const message = typeof httpError?.error?.error === 'string'
        ? httpError.error.error
        : 'Erro ao cadastrar o usuario, tente novamente.';
      window.alert(message);
    } finally {
      this.isSubmitting = false;
    }
  }
}