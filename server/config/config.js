//========================
//Puerto
//=======================

process.env.PORT = process.env.PORT || 3000;

//========================
//Entorno
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================
//BASE DE DATOS
//=======================

let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://192.168.0.18:27017/cafe';
} else {
    urlDB = 'mongodb+srv://nelsick:Fzl8QgmckITVvKSg@cluster0.j67e3.mongodb.net/cafe'
}

process.env.URLDB = urlDB;

