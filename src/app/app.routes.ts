import { Routes } from '@angular/router';
import { LoginScreen } from './user-module/login-screen/login-screen';
import { NewUserScreen } from './user-module/new-user-screen/new-user-screen';
import { NotesScreen } from './notes-screen/notes-screen';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => LoginScreen
    },
    {
        path: "login",
        loadComponent: () => LoginScreen
    },
    {
        path: "new-user",
        loadComponent: () => NewUserScreen
    },
    {
        path: "notes",
        loadComponent: () => NotesScreen,
        canActivate: [authGuard]
    }
];
