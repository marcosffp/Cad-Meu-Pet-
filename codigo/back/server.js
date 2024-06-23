/* Trabalho Interdisciplinar 1 - Aplicações Web

  Esse módulo implementa uma API RESTful baseada no JSONServer
  O servidor JSONServer fica hospedado na seguinte URL
  https://jsonserver.rommelpuc.repl.co/contatos

  Para montar um servidor para o seu projeto, acesse o projeto 
  do JSONServer no Replit, faça o FORK do projeto e altere o 
  arquivo db.json para incluir os dados do seu projeto.

  URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer

  Autor: Rommel Vieira Carneiro (@rommelcarneiro)
  Data: 03/10/2023

*/

/** Adaptado por @profdiegoaugusto */

const jsonServer = require('json-server')
const server = jsonServer.create()

const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'data', 'db.json')
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db)

const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})