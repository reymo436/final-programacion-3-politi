const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, email FROM usuarios ORDER BY id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al obtener usuarios' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, email FROM usuarios WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al obtener usuario' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'nombre, email y password son requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`,
      [nombre, email, password]
    );

    const [rows] = await pool.query(
      `SELECT id, nombre, email FROM usuarios WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al crear usuario' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    await pool.query(
      `UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?`,
      [nombre, email, password, req.params.id]
    );

    const [rows] = await pool.query(
      `SELECT id, nombre, email FROM usuarios WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al actualizar usuario' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM usuarios WHERE id = ?`,
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'usuario no encontrado' });
    res.json({ message: 'usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al eliminar usuario' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password requeridos' });
    }

    const [rows] = await pool.query(
      `SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?`,
      [email, password]
    );

    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error en el login' });
  }
});

module.exports = router;
