const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');
const { generarJWT } = require('../helpers/jwt');

const getUsers = async(req, res) =>{

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 5;
    const { email, name } = req.query;

    // Construir objeto de búsqueda
    const query = {};
    if (email && email !== '') {
        query.email = { $regex: email, $options: 'i' }; // Búsqueda insensible a mayúsculas y minúsculas
    }
    if (name && name !== '') {
        query.name = { $regex: name, $options: 'i' }; // Búsqueda insensible a mayúsculas y minúsculas
    }

    // Promesas simultáneas
    const [users, total] = await Promise.all([
        User.find(query, 'name email google').skip(from).limit(limit),
        User.countDocuments(query)
    ]);

    res.json({
        ok: true,
        users: users,
        total: total
    });
}


const createUser = async(req, res = response) =>{
    
    var status = '';
    var alert = '';
    var response = '';
  
    try {

        const { email, password } = req.body;
        
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ){
            status = 'error';
            alert = 'email duplicado';
        }else{
            const user = new User(req.body);

            //encriptar contrase;a
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync( password, salt);

            // guarda usuario
            await user.save();

            const token = await generarJWT( usuario.id);

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


const updateUser = async(req, res = response) =>{
    
    var status = '';
    var alert = '';
    var response = '';
  
    try {

        // validar si el usuario es el de la sesion
        const uid = req.params.id;
        let existEmail = false;

        const userDB = await User.findById( uid );

        if ( !userDB ){
            status = 'error';
            alert = 'usuario no existe';
        }else{

            // Actualiza
            const { password, google, ...campos } = req.body;
            // la linea anterior hace lo mismo 
            // elimina los campos que no queremos actualizar si el usuario lo envia
            // delete campos.password;
            // delete campos.google;

            if ( userDB.email === campos.email ){
                delete campos.email;
            }else{
                const existEmailRow = await User.findOne( {email: req.body.email } );

                if ( existEmailRow ){
                    existEmail = true;
                }
            }

            

            if ( existEmail == true ){
                // guarda los cambios y retorna el registro actualizado
                status = 'validator';
                alert = 'Email en uso, usar otro email';
                     
            }else{
                // guarda los cambios y retorna el registro actualizado
                const usuarioActualizado = await User.findByIdAndUpdate(uid, campos, { new: true });

                status = 'success';
                alert = 'usuario actualizado';
                response = usuarioActualizado;
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
            response: response
        })
    }
    
}

const deleteUser = async(req, res = response) =>{
    
    var status = '';
    var alert = '';
    var response = '';
  
    try {

        // validar si el usuario es el de la sesion
        const uid = req.params.id;

        const userDB = await User.findById( uid );

        if ( !userDB ){

            status = 'error';
            alert = 'usuario no existe';

        }else{

            await User.findOneAndDelete( uid );

            status = 'success';
            alert = 'usuario eliminado';
            
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
    getUsers,
    createUser,
    updateUser,
    deleteUser
}