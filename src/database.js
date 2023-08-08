const mysql = require('promise-mysql');
const {Notification}= require("electron")

//se crea la conexion mysql
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario08'
};

let connection = null;


//funcion para conectar a la base de datos con reintentos
async function connectToDB(){
    try {
        if(connection && connection.state !== "disconnected"){
            return connection;
        }

        connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        new Notification({
            title: 'Error en conexion',
            body: `error al conectar a la DB ${error.message}`
            }).show();
        
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return connectToDB();
    }
}



//funcion para obtener la conexion a la db con reintentos
async function getConnection() {
    if(connection && connection.state !== "disconnected"){
        return connection;
    }

    try {
        connection = await connectToDB();
        return connection;
    } catch (error) {
        throw new Error("error no se pudo establecer la conexion con la DB");
    }
    
}

module.exports={getConnection}