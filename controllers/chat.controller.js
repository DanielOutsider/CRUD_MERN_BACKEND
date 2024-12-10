const { response } = require('express');
const Message = require('../models/message.model');
const ChatGroup = require('../models/chatGroup.model');

// Obtener mensajes de un grupo
const getGroupMessages = async (req, res = response) => {
    const { groupId } = req.params; // ID del grupo enviado en el path
    const { page = 1, limit = 20 } = req.query; // Página y límite de mensajes
    const userId = req.user.id; // ID del usuario obtenido del JWT

    try {
        // Verificar si el usuario pertenece al grupo
        const group = await ChatGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({
                ok: false,
                msg: 'El grupo no existe',
            });
        }

        const isMember = group.members.some((member) => member.toString() === userId);

        if (!isMember) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes acceso a los mensajes de este grupo',
            });
        }

        // Calcular el número de mensajes a omitir para la paginación
        const messagesPerPage = parseInt(limit, 10);
        const skipMessages = (parseInt(page, 10) - 1) * messagesPerPage;

        // Obtener mensajes del grupo ordenados de forma descendente (últimos mensajes primero)
        const messages = await Message.find({ groupId })
            .sort({ timestamp: -1 }) // Orden descendente
            .skip(skipMessages) // Saltar los mensajes de las páginas anteriores
            .limit(messagesPerPage); // Limitar los mensajes por página

        // Contar el total de mensajes
        const totalMessages = await Message.countDocuments({ groupId });

        res.json({
            ok: true,
            messages: messages.reverse(), // Invertir el orden para que se muestren de antiguos a nuevos
            totalPages: Math.ceil(totalMessages / messagesPerPage),
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los mensajes',
        });
    }
};

// Crear un nuevo mensaje
const createMessage = async (req, res = response) => {
    const { senderId, groupId, receiverId, content } = req.body;

    try {
        const message = new Message({
            senderId,
            groupId,
            receiverId,
            content
        });

        await message.save();

        res.json({
            ok: true,
            message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al enviar el mensaje'
        });
    }
};

// Exportar las funciones
module.exports = {
    getGroupMessages,
    createMessage
};
