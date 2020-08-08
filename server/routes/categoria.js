const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria');


//============================
//Mostrar todas las categorias
//============================

app.get('/categoria', verificaToken, (req, res) => {
    //Deben aparecer todas las categorías

    Categoria.find({})
        .sort('nombre')
        //En populate la primera instrucción es la coleccion y la segunda los parametros
        .populate( 'usuario', 'nombre email' )
        .exec( (err, categoria) => {

            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            });

        });

});

//=============================
//Mostrar una categoria por ID
//=============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    //Debe mostrar la categoria por id

    let id = req.params.id;

    Categoria.findById( id, (err, categoriaDB) => {

        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            categoriaDB
        });
    });
});

//=====================
//Crear nueva categoria
//=====================

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    //Regresa la nueva categoría
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });



    categoria.save( (err, categoriaDB) => {
        
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok:false,
                err
            });
        } 

        res.json({
            ok: true,
            categoriaDB
        });

    });


});

//=======================
//Actualiza una categoría
//=======================

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Deben aparecer todas las categorías
    let id = req.params.id;

    let body = _.pick( req.body, ['nombre', 'descripcion']);

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//
//
//

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Solo la puede borrar un admin
    //Debe pedir un token, elimina fisicamente
    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaBorrada) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});




module.exports = app;