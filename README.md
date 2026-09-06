<div align="center">

<img src="https://raw.githubusercontent.com/twbs/icons/main/icons/journal-text.svg" width="60" alt="Logo" />

# Senai Notes

Um sistema de anotações completo, com login e permissões próprias, construído com **Angular** no front-end e **Java (Spring Boot)** no back-end — publicado em nuvem, pronto para ser acessado de qualquer lugar.

[![Frontend](https://img.shields.io/badge/Frontend-Angular-DD0031?style=flat-square&logo=angular&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=flat-square&logo=spring&logoColor=white)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](#)
[![Deploy Front](https://img.shields.io/badge/Deploy%20Front-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](#)
[![Deploy Back](https://img.shields.io/badge/Deploy%20Back-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](#)

[**🔗 Acessar a aplicação**](https://projeto-senai-notes-angular.vercel.app) · [**📘 Ver documentação da API (Swagger)**](https://springbootapi-senai-notes.onrender.com/swagger-ui.html)

</div>

## Demonstração
<img width="1916" height="916" alt="image" src="https://github.com/user-attachments/assets/40b53807-a63a-4db5-bcfe-d5ebed7e5fee" />
<br>
<br>
<img width="1918" height="918" alt="image" src="https://github.com/user-attachments/assets/c0901375-3729-4a13-9129-69d6f16d21e6" />


---

## Sobre o projeto

O Senai Notes é um app de anotações pessoais: cada usuário cria sua própria conta, escreve e organiza suas notas com título, descrição, imagem e etiquetas, e pode arquivar o que não precisa mais ver no dia a dia. Cada pessoa só enxerga as próprias notas — nada é compartilhado entre contas diferentes.

**Principais funcionalidades:**

- Cadastro de usuário e login protegido por senha
- Criar, editar, arquivar e excluir notas
- Organizar notas por etiquetas (tags)
- Buscar notas por título, descrição ou etiqueta
- Anexar uma imagem a cada nota

## Tecnologias usadas

| Camada | Tecnologia |
|---|---|
| Front-end | Angular |
| Back-end | Java + Spring Boot |
| Autenticação | JWT (login com token, sem senha trafegando depois do login) |
| Banco de dados | PostgreSQL |
| Publicação do front-end | Vercel |
| Publicação do back-end e do banco | Render |

## Como o projeto é organizado

O projeto é dividido em duas partes independentes que conversam entre si pela internet:

- **Front-end (Angular)** — a tela que a pessoa usa: login, cadastro, lista de notas, edição. Sempre que algo é criado ou alterado, ele manda essa informação para o back-end guardar de verdade.
- **Back-end (Spring Boot)** — recebe os pedidos do front-end, confere se a pessoa está autenticada, valida os dados e só então salva ou busca as informações no banco.
- **Banco de dados (PostgreSQL)** — onde os usuários e as notas ficam guardados de forma permanente.

Essa forma de organizar o sistema (tela separada da parte que guarda os dados, se comunicando por uma API) é o padrão mais comum hoje em dia para aplicações web, porque permite atualizar cada parte de forma independente e publicar cada uma na plataforma mais adequada para ela.

## Segurança

O login usa **JWT** (JSON Web Token): ao entrar com e-mail e senha, o usuário recebe um token que prova, nas próximas ações, que ele já está autenticado — sem precisar reenviar a senha toda hora. Esse token também garante que uma pessoa nunca consiga ver ou alterar notas de outra conta.

## Deploy

- O **front-end** está publicado na **Vercel**.
- O **back-end** e o **banco de dados** estão publicados no **Render**.

As duas partes ficam em endereços próprios na internet e se comunicam automaticamente, então o sistema funciona de qualquer lugar com acesso à internet, sem precisar instalar nada na máquina do usuário.
