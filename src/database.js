const mysql = require('promise-mysql');

//se crea la conexion mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario08'
})

//la conexion es reutilizada por ende se usa la funcion
function getConnection() {
    return connection;
}

module.exports={getConnection}