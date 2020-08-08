//========================
//Puerto
//=======================

process.env.PORT = process.env.PORT || 3000;

//========================
//Entorno
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================
//Vencimiento del token
//=======================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = '48h';

//========================
//SEED de autentificacion
//=======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//========================
//BASE DE DATOS
//=======================

let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://192.168.0.18:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//========================
//Google Client ID
//=======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '607076052333-sn727c2iie0euj0ilq7vjlcfoio1j7ik.apps.googleusercontent.com';