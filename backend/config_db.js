const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'miproyecto2',
  port: 3306
});

module.exports = db;

db.getConnection()
  .then(() => console.log("Conectado a MariaDB (Pool mysql2/promise)"))
  .catch(err => console.error("Error conectando a MariaDB:", err));


/*db.connect((err) => {
  if (err) {
    console.error('Error conectando a MariaDB:', err);
    return;
  }
  console.log('Conectado a MariaDB miproyecto2');
});*/

module.exports = db;
