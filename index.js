const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const session = require('express-session');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const cors = require('cors');

const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'codigo')
});

server.use(cors());
server.use(middlewares);
server.use(express.json());
server.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
}));

const db = router.db;

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/relatos') {
    const novoRelato = req.body;

    if (novoRelato) {
      novoRelato.isLikedByUser = novoRelato.isLikedByUser !== undefined ? novoRelato.isLikedByUser : [];
    }
  }
  next();
});

server.post('/relatos/:id', (req, res) => {
  const body = req.body;

  const relato = db.get('relatos').find({ id: parseInt(id) }).value();
  if (!relato) {
    return res.status(404).json({ message: 'Relato not found' });
  }

  const isLikedByUser = relato.isLikedByUser.includes(userId);
  if (isLikedByUser) {
    relato.isLikedByUser = relato.isLikedByUser.filter(uid => uid !== userId);
  } else {
    relato.isLikedByUser.push(userId);
  }

  relato.likes = relato.isLikedByUser.length;

  db.get('relatos').find({ id: parseInt(id) }).assign(relato).write();

  res.json(relato);
});

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/users') {
    const { email } = req.body;
    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail already exists' });
    }
  }
  next();
});

const authenticateUser = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = db.get('users').find({ email, senha }).value();
  if (user) {
    req.session.user = user;
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

server.get('/me', authenticateUser, (req, res) => {
  res.json(req.session.user);
});

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'codigo/html/home.html'));
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running at http://localhost:3000');
});
