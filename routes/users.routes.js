/**
 *      /api/users
 */

const { Router } = require('express');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
// check es un middleware, uno puede crear uno personalizado


const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users.controller');
const router = Router();

router.get('/', validarJWT, getUsers);
router.post('/',[
                    validarJWT,
                    check('name','El nombre es obligatorio').not().isEmpty(),
                    check('password','El password es obligatorio').not().isEmpty(),
                    check('email','Registre un email valido').isEmail(),
                    validarCampos
                ]
                , createUser);

router.put('/:id',[
                    validarJWT,
                    check('name','El nombre es obligatorio').not().isEmpty(),
                    check('email','Registre un email valido').isEmail(),
                    validarCampos
                ]
                , updateUser);

router.delete('/:id',[
                    validarJWT,                    
                ]
                , deleteUser);


module.exports = router;