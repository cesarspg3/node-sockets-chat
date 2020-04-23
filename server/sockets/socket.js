const { io } = require('../server');
const { Users } = require('../classes/users');
const { newMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on( 'entrarChat', (data, callback) => {

        if (!data.name || !data.room) return callback(false);

        console.log('Conectado', data);
        client.join(data.room)
        const allUsers = users.addUser(client.id, data.name, data.room);

        // client.broadcast.emit('listaPersona', users.getAllUsers());
        
        callback(users.getUsersByRoom(data.room));
        
        client.broadcast.emit('listaPersona', users.getUsersByRoom(data.room));
    })

    client.on('disconnect', () => {

        const userDeleted = users.deleteUser(client.id);

        client.broadcast.to(userDeleted.room).emit('crearMensaje', newMessage('Administrador', `${userDeleted.name} abandonó el chat`));
        client.broadcast.to(userDeleted.room).emit('listaPersona', users.getAllUsers());

    })

    client.on('crearMensaje', (data, callback) => {

        console.log(data)
        const user = users.getUser(client.id)
        const message = newMessage(user.name, data.message);

        client.broadcast.to(user.room).emit('crearMensaje', message)

        if (callback && typeof(callback) === 'function') {
            callback(message);
        }

    })

    client.on('mensajePrivado', data => {

        const user = users.getUser(client.id);

        client.broadcast.to(data.to).emit('mensajePrivado', newMessage(user.name, data.message));

    });


});