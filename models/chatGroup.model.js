const { Schema, model } = require('mongoose');

// Definimos el esquema de grupo
const chatGroupSchema  = Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
        required: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Exportamos el modelo
module.exports = model('ChatGroup', chatGroupSchema);
