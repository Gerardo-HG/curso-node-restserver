const exp = require("constants");
const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
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
    //directorio publico
    this.app.use(express.static("public"));
  }
}

module.exports = Server;
