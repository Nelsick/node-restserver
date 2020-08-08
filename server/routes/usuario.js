const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


app.get('/usuario', verificaToken , (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Con el segundo parametro del Usuario.find filtro los campos que quiero que se desplieguen
    Usuario.find({ estado: true }, 'nombre email role estado google img')
           .skip(desde)
           .limit(limite)
           .exec( (err, usuarios) => {
 
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.countDocuments({ estado: true }, (err, conteo) => {

                    res.json({
                        ok: true,
                        cuantos: conteo,
                        usuarios
                });

                });

           });

});

  
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

});
  
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    //Con esta configuración, estamos seleccionando los campos que pueden ser editados con el metodo put
    let body = _.pick( req.body, ['nombre','email','role','estado']);

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
        
    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    
    let id = req.params.id;

    //En esta sección de código declaro la variable que se va a actualizar
    let cambiaEstado = {
        estado: false
    }

    //Más o menos esto -> id del registro - parametro a cambiar - que la respuesta sea la actualizada - callback
    Usuario.findByIdAndUpdate( id, cambiaEstado, { new: true }, (err, usuarioBorrado) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app

