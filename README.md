# Chat em Tempo Real

Este é um projeto de **chat em tempo real** desenvolvido utilizando **Node.js**, **Socket.IO** e **Express.js**. A aplicação permite que múltiplos usuários conversem em tempo real em uma interface simples e interativa.

## 🚀 Funcionalidades

- Comunicação em tempo real entre usuários.
- Notificações de entrada e saída de usuários.
- Exibição de mensagens com carimbo de data/hora (timestamp).
- Interface dinâmica com templates **Mustache.js**.
- Gerenciamento de usuários e salas de chat.

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do servidor.
- **Socket.IO**: Gerenciamento de WebSockets para comunicação em tempo real.
- **Moment.js**: Formatação e manipulação de datas para timestamps.
- **Mustache.js**: Template engine para renderizar HTML dinâmico.
- **Express.js**: Framework para gerenciar rotas e configurações do servidor.

## ⚙️ Instalação e Configuração

1. Clone o repositório:
  ```
  git clone https://github.com/evertonrch/chat-app.git
  cd chat-app
  ```

2. Baixe as dependências do projeto:
  ```
  npm install
  ```

3. Rode o projeto:
  ```
  npm start
  ```

4. A aplicação estará disponível em (a porta pode ser alterada via variável de ambiente definida em PORT):
  ```
  http://localhost:3000
  ```
