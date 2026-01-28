export default class Client {
	#uuid;
	#socket;


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
}