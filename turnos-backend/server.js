// turnos-backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'turnos_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Listar turnos
app.get('/api/turnos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha, TIME_FORMAT(hora,'%H:%i') AS hora, servicio, estado, created_at
       FROM turnos ORDER BY fecha DESC, hora DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al obtener turnos' });
  }
});

// Obtener 1 turno
app.get('/api/turnos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM turnos WHERE id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al obtener turno' });
  }
});

// Crear turno
app.post('/api/turnos', async (req, res) => {
  try {
    const { nombre, fecha, hora, servicio, estado } = req.body;
    if (!nombre || !fecha || !hora) return res.status(400).json({ error: 'nombre, fecha y hora son requeridos' });

    const [result] = await pool.query(
      `INSERT INTO turnos (nombre, fecha, hora, servicio, estado) VALUES (?, ?, ?, ?, ?)`,
      [nombre, fecha, hora, servicio || '', estado || 'pendiente']
    );
    const insertId = result.insertId;
    const [rows] = await pool.query(
      `SELECT id, nombre, DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha, TIME_FORMAT(hora,'%H:%i') AS hora, servicio, estado, created_at FROM turnos WHERE id = ?`,
      [insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al crear turno' });
  }
});

// Actualizar turno
app.put('/api/turnos/:id', async (req, res) => {
  try {
    const { nombre, fecha, hora, servicio, estado } = req.body;
    await pool.query(
      `UPDATE turnos SET nombre = ?, fecha = ?, hora = ?, servicio = ?, estado = ? WHERE id = ?`,
      [nombre, fecha, hora, servicio || '', estado || 'pendiente', req.params.id]
    );
    const [rows] = await pool.query(`SELECT * FROM turnos WHERE id = ?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al actualizar turno' });
  }
});

// Eliminar turno
app.delete('/api/turnos/:id', async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM turnos WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'no encontrado' });
    res.json({ message: 'eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al eliminar' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
