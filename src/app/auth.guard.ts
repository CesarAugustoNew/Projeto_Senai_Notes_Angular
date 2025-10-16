import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const authGuard = () => {

    const router = inject(Router); // Injetando o roteador do projeto.

    const token = localStorage.getItem("token"); // Pega um item do localstorage.

    if (token != null) {

        return true;

    } else {

        router.navigate(["/login"]);
        return false;

    }

}