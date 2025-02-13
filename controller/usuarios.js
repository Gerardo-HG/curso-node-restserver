const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  // const {q, nombre = 'no envia', apikey} = req.query;
  const { limite = 5, desde = 0 } = req.query; // indicamos que vamos a recibir un parámetro: limite, con valor por defecto 5
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query), // retorna total
    Usuario.find(query) // retorna los usuarios
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

// encuentra desde el limite registros de la DB
/*  
const usuarios = await Usuario.find(query)  
  .skip(Number(desde))  
  .limit(Number(limite));  
const total = await Usuario.countDocuments(query);  
*/

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  // verificar si existe correo
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    return res.status(400).json({
      msg: "El correo ya esta registrado",
    });
  }

  // encriptar la contraseña
  const salt = bcryptjs.genSaltSync(); // cantidad de vueltas que hará la encriptación por defecto
  usuario.password = bcryptjs.hashSync(password); // encripta el password
  await usuario.save(); // esto es para grabar en BD
  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params; // params puede traer muchos datos.

  //excluyo password, google y correo (no se actualizan) y todo lo demas lo almaceno es resto
  const { _id, password, google, correo, ...resto } = req.body;

  //POR HACER validar id contra la DB

  if (password) {
    //encritar la contraseña en caso que venga en el body
    const salt = bcryptjs.genSaltSync(); //cantidad de vueltas que hara la encriptacion por def.10
    resto.password = bcryptjs.hashSync(password); //encripta el password
  }

  //actualiza el registro: lo busca por id y actualiza con los valores de resto
  const usuario = await Usuario.findOneAndUpdate(id, resto);

  res.json({
    id,
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  // borrado fisico
  //const usuario = await Usuario.findByIdAndDelete(id);

  // borrado logico
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  res.json({
    usuario,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({});
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
