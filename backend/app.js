const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./config_db'); // >> CONEXION BD


// ------------------- MIDDLEWARES -------------------
app.use(cors());
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true })); // opcional para formularios

// RUTAS
app.use("/api", require("./routes/auth"));
app.use("/api/publicaciones", require("./routes/publicaciones"));
app.use("/api/comentarios", require("./routes/comentarios"));
app.use("/api/usuario", require("./routes/usuarios"));
// luego agregaremos más: publicaciones, usuarios, etc.

module.exports = app;

