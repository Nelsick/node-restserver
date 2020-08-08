const mongoose = require('mongoose');

const mongooseUniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    descripcion: {
        type: String,
        required:[true, 'Es necesaria una descripción']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


categoriaSchema.plugin( mongooseUniqueValidator, { message: '{PATH} debe ser único' });


module.exports = mongoose.model('Categoria', categoriaSchema);