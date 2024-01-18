const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');
const { generarJWT } = require('../helpers/jwt');


const login = async(req, res = response) =>{
    
    var status = '';
    var alert = '';
    var response = '';
  
    try {

        const { email, password } = req.body;
        
        // verificar email
        const userDB = await User.findOne({ email });

        if ( !userDB ){
            status = 'error';
            alert = 'email no encontrado';
        }else{
            // valida contrasenia
            const validaContrasenia = bcryptjs.compareSync( password, userDB.password );

            if ( !validaContrasenia ){
                status = 'error';
                alert = 'password no valido';
            }else{
                // generar token - JWT
                const token = await generarJWT( userDB.id);
                status = 'success';
                alert = 'Login satisfactorio';
                response = token;
            }

        }
        
    } catch (error) {
        console.log(error);
        status = 'error';
        alert = error;
    }finally{
        res.json({
            status: status,
            alert: alert,
            token: response
        })
    }
    
}

const register = async(req, res = response) =>{
    
    var status = '';
    var alert = '';
    var response = '';
  
    try {

        const { email, password } = req.body;
        
        const existeEmail = await User.findOne({ email });

        if ( existeEmail ){
            status = 'error';
            alert = 'email duplicado';
        }else{
            const user = new User(req.body);

            //encrypt password
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync( password, salt);

            // save user
            await user.save();

            const token = await generarJWT( user.id);

            status = 'success';
            alert = 'usuario registrado';
            response = { 'user' : user, 'token': token };
        }
        
    } catch (error) {
        console.log(error);
        status = 'error';
        alert = error;
    }finally{
        res.json({
            status: status,
            alert: alert,
            response: response
        })
    }
    
}



module.exports = {
    login,
    register
}