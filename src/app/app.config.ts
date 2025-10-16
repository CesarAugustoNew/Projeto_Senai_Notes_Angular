import { ApplicationConfig, inject, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

registerLocaleData(localePt);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router); // Direciona para as telas.

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      if (err.status == 401) {
        // Token expirou
        localStorage.clear(); // Limpa todos os dados do localstorage.

        router.navigate(['/login']); // Redireciona para o login.
      }

      return throwError(() => err);

    })
  );

}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([ authInterceptor ])
    ), // Instância o HttpModule
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' } // Locale brasileiro,
  ]
};
