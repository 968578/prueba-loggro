// Librerias
const { MongoClient} = require("mongodb");
require("dotenv").config();

/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @descripcion Esta función establece una conexión con la base de datos MongoDB utilizando los parámetros 
 * de conexión almacenados en las variables de entorno (usuario, contraseña, host y nombre de la base de datos).
 * Si la conexión es exitosa, devuelve la base de datos "images". En caso de error, imprime un mensaje 
 * de fallo en la conexión y lanza el error.
 * @returns {Promise} Devuelve una promesa con la base de datos "images" si la conexión es exitosa.
 */
const getConnection = async()=>{
  try {
    const cliente = await MongoClient.connect(`mongodb://${process.env.USER_DB_MONGO}:${process.env.PASSWORD_DB_MONGO}@${process.env.HOST_DB_MONGO}:27017/${process.env.DATABASE_DB_MONGO}?authSource=admin`)
    console.log("db conectada")
    return cliente.db("images")
  } catch (error) {
    console.log("Fallo en la coneccion")
    throw error;
  }
}

module.exports ={
  getConnection
}