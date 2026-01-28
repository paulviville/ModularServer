import ModulesManager from "./ModulesManager.js";

export default class Instance {
	#uuid = crypto.randomUUID( );

	#modulesManager = new ModulesManager ( );
	#clients = new Set ( );

	constructor ( ) {
        console.log( `Instance - constructor` );
	}

	get uuid ( ) {
		return this.#uuid;
	}

	addClient ( clientUUID ) {
        console.log( `Instance - addClient ${ clientUUID }` );

		this.#clients.add( clientUUID );
	}

	removeClient ( clientUUID ) {
		console.log( `Instance - removeClient ${ clientUUID }` );

		this.#clients.delete( clientUUID );
	}

	get clients ( ) {
		return [ ...this.#clients ];
	}
}