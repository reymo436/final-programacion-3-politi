// turnos-backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar las rutas
const turnosRoutes = require('./routes/turnos');
const usuariosRoutes = require('./routes/usuarios');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/turnos', turnosRoutes);
app.use('/api/usuarios', usuariosRoutes);
// Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
