const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'srv70.octenium.net',
    user: 'zpbavgpr_test',         
    password: '2S7pshgUgcQZc4W',        
    database: 'zpbavgpr_test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};  
const db = mysql.createPool(dbConfig);

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connexion réussie à la base de données MySQL');
    connection.release(); // Libère la connexion
  } catch (err) {
    console.error('Erreur de connexion à MySQL :', err.message);
  }
})();

module.exports = db;
