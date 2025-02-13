const exp = require("constants");
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usuariosPath = "/api/usuarios";
    //llamada a conectarDB
    this.conectarDB();
    // Middlware
    this.middlewares();
    //Rutas de la aplicacion
    this.routes();
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriend puerto ", this.port);
    });
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //lectura y parseo del body recibe lo que se envia
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static("public"));
  }

  async conectarDB() {
    await dbConnection();
  }
}

module.exports = Server;
