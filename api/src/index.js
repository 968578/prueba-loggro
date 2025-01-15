// Librerias
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors =  require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));  

// Rutas
app.use("/apiv1/image", require("./controllers/controller-image") )
app.use("/apiv1/user", require("./controllers/controller-user") )

const port = process.env.API_PORT || 3001;
app.listen(port, ()=>{
  console.log("Api escuchando en:", port);
})