const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { createChatGroup, getChatGroups } = require('../controllers/chatGroup.controller');
const router = Router();

// Obtener grupos de chat
router.get('/', validarJWT, getChatGroups); // Obtener todos los grupos del usuario

// Crear un nuevo grupo
router.post('/', [
    validarJWT,
    check('name', 'El nombre del grupo es obligatorio').not().isEmpty(),
    check('members', 'Se deben incluir miembros del grupo').isArray().not().isEmpty(),
    validarCampos
], createChatGroup);

module.exports = router;
