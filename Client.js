export default class Client {
	#uuid;
	#socket;
	#moduleUUIDs = new Set( );

	constructor ( uuid ) {
        console.log( `Clients - constructor ${ uuid }` );

		this.#uuid = uuid;
	}

	get uuid ( ) {
		return this.#uuid;
	}

	set socket ( socket ) {
		this.#socket = socket;
	} 

	get socket ( ) {
		return this.#socket;
	}

	addModule ( moduleUUID ) {
		this.#moduleUUIDs.add( moduleUUID );
		console.log( `+ ${this.#uuid}: ${this.#moduleUUIDs}`)
	}

	removeModule ( moduleUUID ) {
		this.#moduleUUIDs.delete( moduleUUID )
		console.log( `- ${this.#uuid}: ${this.#moduleUUIDs}`)
	}

	get moduleUUIDs ( ) {
		return this.#moduleUUIDs;
	}
}