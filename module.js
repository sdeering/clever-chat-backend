var ModuleClass = require( 'classes' ).ModuleClass
  , io = require( 'socket.io' )
  , server = require( 'http' ).createServer( app )
  , io = io.listen( server )
  , Module;

Module = ModuleClass.extend({

	configureApp: function( app ) {

		if ( this.config.chat.enabled ) {

			// listen to port (default 8080 - same as express)
			server.listen( this.config.chat.port );
			console.log( 'Express + Socket.io server is running and listening to port %d...', this.config.chat.port );

			// hash object to save clients data,
			// { socketid: { clientid, nickname }, socketid: { ... } }
			var chatClients = [];

			// sets the log level of socket.io, with
			// log level 2 we wont see all the heartbeats
			// of each socket but only the handshakes and
			// disconnections
			io.set( 'log level', this.config.chat.loglevel );

			// setting the transports by order, if some client
			// is not supporting 'websockets' then the server will
			// revert to 'xhr-polling' (like Comet/Long polling).
			// for more configurations got to:
			// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
			io.set( 'transports', this.config.chat.transports );

			// Setup transports for different environments:
			// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
			// See: config/profuction.json
			// - reduce loging for production
			// - enable all transports (optional if you want flashsocket support, please note that some hosting
			//   providers do not allow you to create servers that listen on a port different than 80 or their
			//   default port)

			if ( this.config.chat.enableClientMinification ) {
				io.enable( 'browser client minification' );  // send minified client
			}

			if ( this.config.chat.enableETag ) {
				io.enable( 'browser client etag' );  // apply etag caching logic based on version number
			}

			if ( this.config.chat.enableGZip ) {
				io.enable( 'browser client gzip' );  // gzip the file
			}

			// socket.io events, each connection goes through here
			// and each event is emited in the client.
			io.sockets.on( 'connection', function( socket ) {

			    // after connection, the client sends us the
			    // client data through the connect event
			    socket.on( 'connect', function( data ) {
			        connect( socket, data );
			    });

			    // when a client sends a messgae, he emits
			    // this event, then the server forwards the
			    // message to other clients
			    socket.on( 'chatmessage', function( data ) {
			        chatmessage( socket, data );
			        console.log( data );
			    });

			    // sends the user list to the user.
			    socket.on( 'userlist', function( data ) {
			        userlist( socket, data );
			    });

			    // when a client calls the 'socket.close()'
			    // function or closes the browser, this event
			    // is built in socket.io so we actually dont
			    // need to fire it manually
			    socket.on( 'disconnect', function() {
			        disconnect( socket );
			    });
			});

		}

	}

});

module.exports = new Module( 'chat-module', injector );
