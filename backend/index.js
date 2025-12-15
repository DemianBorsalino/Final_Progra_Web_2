const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`El servidor de Express esta corriendo en http://localhost:${PORT}`);
});

// Rutas de la API
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});
  