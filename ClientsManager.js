import Client from "./Client.js";

export default class ClientsManager {
	#clients = new Map( );

	constructor ( ) {
        console.log( `ClientsManager - constructor` );


	}

	createClient ( clientUUID ) {
        console.log( `ClientsManager - createClient` );

		const client = new Client( clientUUID );
		this.#clients.set( clientUUID, client );

		return client;
	}

	deleteClient ( uuid ) {
        console.log( `ClientsManager - deleteClient ${ uuid }` );

		this.#clients.delete ( uuid );
	}

	forEach ( callback ) {
        console.log( `ClientsManager - forEach` );

		this.#clients.forEach( ( client, clientUUID ) => {
			callback( client, clientUUID );
		} );
	}
}