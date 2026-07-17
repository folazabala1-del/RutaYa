import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

export const authRouter = Router();

function isValidDni(dni) {
  return /^\d{8}$/.test(dni);
}

function signToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function publicUser(user) {
  return { id: user.id, dni: user.dni, name: user.name };
}

authRouter.post('/register', async (req, res) => {
  const { dni, password, name } = req.body;

  if (!isValidDni(dni || '')) {
    return res.status(400).json({ error: 'El DNI debe tener 8 dígitos.' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres.' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE dni = ?').get(dni);
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese DNI.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const info = db
      .prepare('INSERT INTO users (dni, password_hash, name) VALUES (?, ?, ?)')
      .run(dni, hash, name || 'Usuario RutaYa');

    const user = db.prepare('SELECT id, dni, name FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = signToken(user);
    res.status(201).json({ user: publicUser(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al registrar.' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { dni, password } = req.body;

  if (!isValidDni(dni || '') || !password) {
    return res.status(400).json({ error: 'DNI y contraseña son obligatorios.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE dni = ?').get(dni);
    if (!user) {
      return res.status(401).json({ error: 'DNI o contraseña incorrectos.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'DNI o contraseña incorrectos.' });
    }

    const token = signToken(user);
    res.json({ user: publicUser(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

authRouter.get('/me', (req, res) => {
  res.json({ ok: true });
});
