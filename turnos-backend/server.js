require('dotenv').config();
const express = require('express');
const cors = require('cors');
//importar rutas
const turnosRoutes = require('./routes/turnos');
const usuariosRoutes = require('./routes/usuarios');
const app = express();
//
app.use(cors());
app.use(express.json());
app.use('/api/turnos', turnosRoutes);
app.use('/api/usuarios', usuariosRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
