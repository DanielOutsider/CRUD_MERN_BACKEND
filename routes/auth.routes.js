/**
 *      /api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator'); 
const { validarCampos } = require('../middlewares/validar-campos');
// check es un middleware, uno puede crear uno personalizado


const { login, register } = require('../controllers/auth.controller');
const router = Router();


router.post('/login',[
                    check('email','Registre un email valido').isEmail(),
                    check('password','El password es obligatorio').not().isEmpty(),
                    validarCampos
                ]
                , login)

router.post('/register',[
                    check('name','El nombre es obligatorio').not().isEmpty(),
                    check('password','El password es obligatorio').not().isEmpty(),
                    check('email','Registre un email valido').isEmail(),
                    validarCampos
                ]
                , register);



module.exports = router;