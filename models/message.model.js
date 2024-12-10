const { Schema, model } = require('mongoose');

const messageSchema = Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatGroup', // Referencia al modelo Group
        required: false, // Puede ser nulo si es un mensaje directo
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User (para mensajes directos)
        required: false, // Puede ser nulo si es un mensaje de grupo
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Exportamos el modelo
module.exports = model('Message', messageSchema);
