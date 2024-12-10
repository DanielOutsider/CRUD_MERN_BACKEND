const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getGroupMessages, createMessage } = require('../controllers/chat.controller');

const router = Router();

// Obtener mensajes entre dos usuarios o de un grupo
//router.get('/:userId1/:userId2', validarJWT, getMessages); // Mensajes directos

router.get('/group/:groupId', validarJWT, getGroupMessages); // Mensajes de grupo

// Crear un nuevo mensaje
router.post('/', [
    validarJWT,
    // Aquí podrías añadir validaciones adicionales si es necesario
], createMessage);

module.exports = router;
