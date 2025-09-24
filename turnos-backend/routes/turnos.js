// turnos-backend/routes/turnos.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos los turnos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre_cliente, DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha, 
              TIME_FORMAT(hora,'%H:%i') AS hora, servicio, estado, usuario_id
       FROM turnos 
       ORDER BY fecha DESC, hora DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al obtener turnos' });
  }
});

// Obtener 1 turno por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre_cliente, DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha, 
              TIME_FORMAT(hora,'%H:%i') AS hora, servicio, estado, usuario_id
       FROM turnos WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al obtener turno' });
  }
});

// Crear un turno
router.post('/', async (req, res) => {
  try {
    const { nombre_cliente, fecha, hora, servicio, estado, usuario_id } = req.body;
    if (!nombre_cliente || !fecha || !hora) {
      return res.status(400).json({ error: 'nombre_cliente, fecha y hora son requeridos' });
    }

    const [result] = await pool.query(
      `INSERT INTO turnos (nombre_cliente, fecha, hora, servicio, estado, usuario_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_cliente, fecha, hora, servicio || '', estado || 'pendiente', usuario_id || null]
    );

    const insertId = result.insertId;
    const [rows] = await pool.query(
      `SELECT id, nombre_cliente, DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha, 
              TIME_FORMAT(hora,'%H:%i') AS hora, servicio, estado, usuario_id
       FROM turnos WHERE id = ?`,
      [insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al crear turno' });
  }
});

// Actualizar un turno
router.put('/:id', async (req, res) => {
  try {
    const { nombre_cliente, fecha, hora, servicio, estado, usuario_id } = req.body;

    await pool.query(
      `UPDATE turnos 
       SET nombre_cliente = ?, fecha = ?, hora = ?, servicio = ?, estado = ?, usuario_id = ?
       WHERE id = ?`,
      [nombre_cliente, fecha, hora, servicio || '', estado || 'pendiente', usuario_id || null, req.params.id]
    );

    const [rows] = await pool.query(
      `SELECT id, nombre_cliente, DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha, 
              TIME_FORMAT(hora,'%H:%i') AS hora, servicio, estado, usuario_id
       FROM turnos WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al actualizar turno' });
  }
});

// Eliminar un turno
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM turnos WHERE id = ?`,
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'no encontrado' });
    res.json({ message: 'eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error al eliminar' });
  }
});

module.exports = router;
