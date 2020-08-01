require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

const conection = async() => {
    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology:true
            });
        
            console.log('Base de datos ONLINE');
    } catch (err) {
        return `No se pudo conectar con la base de datos ${ err }`
    }
};

conection();
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', 3000);
});
