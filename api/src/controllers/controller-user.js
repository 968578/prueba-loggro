// Librerias
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Servicios
const { getConnection } = require("../services/mongo-connection");

// Respuestas
const { responseOk, responseErrorServer, responseFailLogin } = require("../services/responses");

// Middlewares
const { verifyToken } = require("../middlewares/verify-user");


const router = Router();

/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @params Este controlador recibe en el cuerpo de la petición las propiedades "name" y "password" desde el frontend.
 * @descripcion Este controlador autentica al usuario utilizando una librería que encripta la contraseña. 
 * Luego, genera y envía un token JWT que tiene un tiempo de expiración de 10 minutos, y se utilizará para autenticar 
 * las peticiones subsiguientes durante ese período.
 */
router.post("/login",  async (req, res) => {
  const { name, password } = req.body;

  try {
    const connection = await getConnection();
    const userCollection = connection.collection("users");
    
    // se crea el registro en Mongo
    const user = await userCollection.findOne({name});
    if(!user){
      return responseFailLogin(res, false);
    }

    let passIsValid = bcrypt.compareSync(password, user.password);
    if(!passIsValid){
      return responseFailLogin(res, true)
    }

    const token = jwt.sign({ user : user.name }, process.env.SECRET_KEY_JWT, { expiresIn: "1h" });
    responseOk(res, {token, user : user.name});
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-01-13
 * @params No recibe parámetros.
 * @descripcion Este controlador retorna un arreglo con todos los usuarios registrados en el sistema.
 */
router.get("/", verifyToken, async (req, res) => {

  try {
    const connection = await getConnection();
    const userCollection = connection.collection("users");
    
    const users = await userCollection.find({},
      {
        projection: {
          password: 0,
        }
      }
    ).toArray();

    responseOk(res,users);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


module.exports = router;