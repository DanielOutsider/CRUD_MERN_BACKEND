const { response } = require('express');
const { validationResult } = require('express-validator');


const validarCampos = (req, res = response, next ) => {

    const errores = validationResult( req ); // crea un arreglo de errores generados en la route
        
    //console.log(errores.mapped());
    if ( !errores.isEmpty() ){

        return res.status(400).json({
            starus: 'validator',
            errors: errores.mapped()
        });
       
    }

    next();
}

// se declara para pueda usarse externamente
module.exports = { 
    validarCampos }