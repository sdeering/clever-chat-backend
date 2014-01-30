/**
 * @doc module
 * @name chatModule.controllers:ChatController
 * @description
 * Sets up chat.
 */
module.exports = function( CurrencyService ) {
    return (require('classes').Controller).extend(
    {
        service: ChatService
    },
    {


		// create a client for the socket
		function connect(socket, data){
		    // chatClients[socket.id] = data;
		    data.socketid = socket.id;
		    chatClients.push(data);
		    // there is some bug here where this needs to be broadcasted also...
		    // this works but needs to be investigated...
		    // (same for disconnect below)
		    socket.emit('userlist', chatClients);
		    socket.broadcast.emit('userlist', chatClients);
		    var msg = {
		        id: new Date().getTime(),
		        user: 'chatroom',
		        type: 'room',
		        text: 'User ' + data.username + ' has joined.'
		    };
		    socket.emit('chatmessage', msg);
		    socket.broadcast.emit('chatmessage', msg);
		}

		// when a client disconnect
		function disconnect(socket){
		    var username = "";
		    chatClients = chatClients.filter(function( obj ) {
		        if (obj.socketid == socket.id) {
		            username = obj.username;
		        }
		        return obj.socketid !== socket.id;
		    });
		    socket.emit('userlist', chatClients);
		    socket.broadcast.emit('userlist', chatClients);
		    var msg = {
		        id: new Date().getTime(),
		        user: 'chatroom',
		        type: 'room',
		        text: 'User ' + username + ' has left.'
		    };
		    socket.emit('chatmessage', msg);
		    socket.broadcast.emit('chatmessage', msg);
		}

		// receive chat message from a client
		function chatmessage(socket, data){
		    // by using 'socket.broadcast' we can send/emit
		    // a message/event to all other clients except
		    // the sender himself
		    socket.broadcast.emit('chatmessage', data);
		}

		// receive user list request from a client
		function userlist(socket, data){
		    socket.emit('userlist', chatClients);
		    socket.broadcast.emit('userlist', chatClients);
		}



    	
    });
};
