// import express from 'express'  // es lo mismo que abajo
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors')
const http = require('http'); // Importa http para crear el servidor
const socketIO = require('socket.io'); // Importa socket.io

require('dotenv').config();

//crea el servidor en express
const app = express();
const server = http.createServer(app); // Crea un servidor HTTP
const io = socketIO(server); // Inicializa Socket.IO

// configuramos CORS
// USE = se usa para definir  un middleware
app.use( cors() );

// lectura y parseo de body = request de datos
app.use( express.json() );

// base de datos
dbConnection();



// rutas
app.use( '/api/chat', require('./routes/chat.routes') );
app.use('/api/chat-groups', require('./routes/chatGroup.routes'));
app.use( '/api/manage/users', require('./routes/users.routes') );
app.use( '/api/auth', require('./routes/auth.routes') );


// Configura eventos de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('sendMessage', (data) => {
        io.emit('newMessage', data); // Envía el mensaje a todos los clientes
    });
});


// selecciono el puerto en el q va a correr
app.listen(process.env.PORT,()=>{
    console.log('servidor corriendo en el puerto' + process.env.PORT);
});