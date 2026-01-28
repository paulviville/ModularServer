import { WebSocketServer, WebSocket } from "ws";
import ClientsManager from "./ClientsManager.js";
// import Instance from "./Instance.js";
import ModulesManager from "./ModulesManager.js";


const messageScope = {
	system: "SYSTEM",
	instance: "INSTANCE",
	module: "MODULE",
};

export default class ServerNetwork {
	#uuid = "00000000-0000-0000-0000-000000000000";
	#server;

	#sockets = new Set( );
	#clientsManager = new ClientsManager( );
	// #instance = new Instance( );
	#moduleManager = new ModulesManager( this );

	constructor ( port ) {
		console.log(`ServerNetwork - constructor (${port})`);
		this.#server = new WebSocketServer({ port: port });

		this.#server.on('connection', ( socket ) => {
			this.#handleConnection( socket );
		});

		process.on('SIGINT', ( ) => { this.#handleShutdown( ); })
		process.on('SIGTERM', ( ) => { this.#handleShutdown( ); })
	}

	#handleConnection ( socket ) {
        console.log(`ServerNetwork - #handleConnection`);

		this.#sockets.add( socket );

		socket.once('message', ( message ) => { 
			const data = JSON.parse( message );

			/// DEBUG
			console.log("first message: ", data);

			const { uuid } = data;
			if ( uuid ) {
				const client = this.#clientsManager.createClient( uuid );
				client.socket = socket;
				
				socket.on('message', ( message ) => { this.#handleMessage( uuid, message ); });
				socket.on('close', ( ) => { this.#handleClose( uuid ); });
			}
			else {
				console.log( "client failed to identify ");
				socket.terminate( )
			}
		});

	}

	#handleMessage ( clientUUID, message ) {
        console.log(`ServerNetwork - #handleMessage ${ clientUUID }`);

		const messageData = JSON.parse( message );
	
		console.log( messageData );
		console.log(messageData.scope, messageScope.module)
		if ( messageData.scope == messageScope.module ) {
			const { moduleUUID } = messageData.data;
			this.receive ( moduleUUID,  messageData.data.message );
			
			this.#broadcast( JSON.stringify( messageData ), messageData.senderUUID );

		}
	}

	#handleClose( clientUUID ) {
        console.log(`ServerNetwork - #handleClose ${ clientUUID }`);

		/// Add timeout + callback for deletion, enables reconnection.
		this.#clientsManager.deleteClient( clientUUID );


		// const message = Messages.removeUser(clientId);
		// this.#broadcast(message);
	}

	#handleShutdown ( ) {
        console.log(`ServerNetwork - #handleShutdown`);

		/// cleanup
		this.#clientsManager.forEach( ( client ) => {
			client.socket.terminate( );
		} );

		this.#server.close();
	}

	#broadcast ( message, exludedUUID ) {
		this.#clientsManager.forEach( ( client ) => {
			if ( client.uuid == exludedUUID )
				return;

			client.socket.send( message );
		} );
	}


	send ( moduleUUID, message ) {
		console.log( `ClientNetwork - send` );
		console.log ( moduleUUID, message );
		
		const networkMessage = {
			senderUUID: this.#uuid,
			scope: "MODULE",
			data: {
				moduleUUID,
				message,
			}
		}
		
		this.#broadcast( JSON.stringify( networkMessage ) );

		// this.#socket.send(
		// 	JSON.stringify( { networkMessage } )
		// );
	}

	receive ( moduleUUID, data ) {
		console.log( `ClientNetwork - receive` );

		console.log ( moduleUUID, data );

		const module = this.#moduleManager.modules.get( moduleUUID );
		console.log(module);
		module.input( data );

		console.log(this.#moduleManager.modules)
	}
}