import Client from "./Client.js";

export default class ClientsManager {
	#clients = new Map( );

	constructor ( ) {
        console.log( `ClientsManager - constructor` );


	}

	createClient ( clientUUID ) {
        console.log( `ClientsManager - createClient ${ clientUUID }` );

		const client = new Client( clientUUID );
		this.#clients.set( clientUUID, client );

		return client;
	}

	deleteClient ( uuid ) {
        console.log( `ClientsManager - deleteClient ${ uuid }` );

		this.#clients.delete ( uuid );
	}

	getClient ( uuid ) {
        console.log( `ClientsManager - getClient ${ uuid }` );
		console.log(this.#clients)
		console.log(this.#clients.get( uuid ))
		return this.#clients.get( uuid );
	}

	forEach ( callback ) {
        console.log( `ClientsManager - forEach` );

		this.#clients.forEach( ( client, clientUUID ) => {
			callback( client, clientUUID );
		} );
	}
}