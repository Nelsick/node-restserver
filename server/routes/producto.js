const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const _ = require('underscore');

let app = express();

let Producto = require('../models/producto');


//=========================
// Obtener productos
//=========================

app.get('/productos', verificaToken, (req,res) => {

    //Trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(limite)
            .populate( 'usuario', 'nombre email' )
            .populate( 'categoria', 'nombre descripcion' )
            .exec( ( err, producto ) => {

                if ( err ){

                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({ disponible: true }, (err, conteo) => {
                    
                    res.json({
                        ok: true,
                        cuantos: conteo,
                        producto
                    });

                });


            });

});

//============================
// Obtener un producto por ID
//============================

app.get('/productos/:id', verificaToken, (req,res) => {

    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById( id )
            .populate( 'usuario', 'nombre email')
            .populate( 'categoria', 'nombre')
            .exec( (err, productoDB) => {
                
                if ( err ) {
                    return res.json({
                        ok: false,
                        err
                    })
                }
        
                if ( !productoDB ) {
                    return res.json({
                        ok: false,
                        message: 'No existe ese producto'
                    });
                }
        
                res.json({
                    ok: true,
                    productoDB
                });

            });

});

//============================
// Buscar productos
//============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Expresión regular, la i es para no ser sensible a mayus
    //Sirve para hacer busquedas sin el termino completo
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .populate('producto', 'nombre')
            .exec( (err, productos) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } 

                if ( !productos ) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'No existe el producto',
                            err
                        }
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            });

});

//============================
// Crear un nuevo producto
//============================

app.post('/productos', verificaToken, (req,res) => {

    //grabar el usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {

        if ( err ){
             return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

//============================
// Actualizar un producto
//============================

app.put('/productos/:id', verificaToken, (req,res) => {

    let id = req.params.id;
    let body = _.pick( req.body, ['precioUni', 'descripcion', 'disponible', 'categoria'] );

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, ( err, productoDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe el producto'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//============================
// Borrar un producto
//============================

app.delete('/productos/:id', verificaToken, (req,res) => {

    //pasar disponible a false
    let id = req.params.id;

    let cambiarDisponibilidad = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiarDisponibilidad, (err, productoBorrado) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoBorrado ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto eliminado correctamente',
            producto: productoBorrado
        });

    });

});












module.exports = app;