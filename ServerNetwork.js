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
	#moduleManager = new ModulesManager( this, this.send.bind( this ) );

	constructor ( port ) {
		console.log(`ServerNetwork - constructor (${port})`);
		this.#server = new WebSocketServer({ port: port });

		this.#server.on('connection', ( socket ) => {
			this.#handleConnection( socket );
		});

		process.on('SIGINT', ( ) => { this.#handleShutdown( ); })
		process.on('SIGTERM', ( ) => { this.#handleShutdown( ); })

		this.#moduleManager.setModuleProcessing(
			( module ) => {
       			console.log(`adding module owned by ${ module.ownerUUID }`);
				const client = this.#clientsManager.getClient( module.ownerUUID );
				client.addModule( module.uuid );
			},
			( module ) => {
       			console.log(`removing module owned by ${ module.ownerUUID }`);

				const client = this.#clientsManager.getClient( module.ownerUUID );
				client.removeModule( module.uuid );
			}
		);
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

				this.#handleNewClient( uuid );
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

	#handleNewClient ( clientUUID ) {
        console.log(`ServerNetwork - #handleNewClient ${ clientUUID }`);

		// console.log(this.#moduleManager.state)
		// const state = this.#moduleManager.state;
		// const messageData = {
		// 	senderUUID: this.#uuid,
		// 	scope: "MODULE",
		// 	data: {
		// 		moduleUUID: this.#moduleManager.uuid,
		// 		message: {
		// 			command: "SET_STATE",
		// 			data: state,	
		// 		}
		// 	}
		// }

		// this.#send( clientUUID, JSON.stringify( messageData ) );


		const stateData = this.#moduleManager.stateCommand( );
		console.log(stateData)
		const messageData = {
			senderUUID: this.#uuid,
			scope: "MODULE",
			data: {
				moduleUUID: this.#moduleManager.uuid,
				message: stateData,
			}
		}
		this.#send( clientUUID, JSON.stringify( messageData ) );

		for ( const [ moduleUUID, module ] of this.#moduleManager.modules ) {
			console.log(moduleUUID, module)
			if ( moduleUUID == this.#moduleManager.uuid ) {
				continue; 
			}
			const messageData = {
				senderUUID: this.#uuid,
				scope: "MODULE",
				data: {
					moduleUUID: moduleUUID,
					message: module.stateCommand( ),
				}
			}

			this.#send( clientUUID, JSON.stringify( messageData ) );
		}

		// send ( moduleUUID, message )
		// console.log( `ClientNetwork - send` );
		// console.log ( moduleUUID, message );
		
		// const networkMessage = {
		// 	senderUUID: this.#uuid,
		// 	scope: "MODULE",
		// 	data: {
		// 		moduleUUID,
		// 		message,
		// 	}
		// }
		
		// this.#broadcast( JSON.stringify( networkMessage ) );

	}

	#handleClose( clientUUID ) {
        console.log(`ServerNetwork - #handleClose ${ clientUUID }`);

		const client = this.#clientsManager.getClient( clientUUID );
		for ( const moduleUUID of client.moduleUUIDs ) {
			this.#moduleManager.removeModule( moduleUUID, true );
		}
		// console.log( "client: ", client )
		// console.log( "clientUUID:", client.moduleUUIDs )

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

	#send ( clientUUID, message ) {
        console.log(`ServerNetwork - #send ${ clientUUID }`);

		const client = this.#clientsManager.getClient( clientUUID );
		client.socket.send( message );
	}




	/// module bus stuff
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