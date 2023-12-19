const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const status = {estado:true};
    
    const [total, usuarios] = await Promise.all([
        //* Contabiliza los activos
        Usuario.countDocuments(status),
        //* Pide los datos a la bd
        Usuario.find(status)
            //* Establece un desde
            .skip(Number(desde))
            //* Establece un límite 
            .limit(Number(limite)),
    ]);

    res.json({
        total, usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;

    //*Grabar la instancia
    const usuario = new Usuario({nombre, correo, password, rol});

    //* Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //*Grabar el dato en MongoDB
    await usuario.save();

    res.json({
        msg: "Usuario guardado",
        usuario,
    });
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    if(password){
        //* Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: `${id} fue actualizado`,
        usuarioDB,
    });
}

const usuariosDelete = async(req, res = response) => {
    
    const {id} = req.params;
    
    //* Físicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        msg: `El ${id} usuario fue eliminado`,
        usuario,
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador",
    });
}


  module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
  }