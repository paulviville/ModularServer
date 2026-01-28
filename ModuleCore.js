export default class ModuleCore {
	#type;
	#uuid;
	#emit;

	// #needsUpdate = false;
	#handlers = new Map( );
	#commands = new Set( );

	constructor ( uuid = crypto.randomUUID( ), type = "ModuleCore" ) {
		console.log( `ModuleCore - constructor - ${ uuid } ${ type }` );
		
		this.#uuid = uuid;
		this.#type = type; 
	}

	get uuid ( ) {
		return this.#uuid;
	}

	set emitter ( network ) {
		console.log( `ModuleCore - emitter - ${ network }` );

		this.#emit = network.send.bind( network, this.#uuid );
		console.log(this.#emit)
	}

	addCommand ( command ) {
		console.log( `ModuleCore - addCommand - ${ command }` );

		this.#commands.add( command );
	}

	removeCommand ( command ) {
		console.log( `ModuleCore - removeCommand - ${ command }` );

	}

	addHandler ( command, handler ) {
		console.log( `ModuleCore - addHandler - ${ command }` );

		this.#handlers.set( command, handler );
	}

	removeHandler ( command ) {
		console.log( `ModuleCore - removeHandler - ${ command }` );
		
		this.#handlers.delete( command );
	};

	input ( message ) {
		console.log( `ModuleCore - input` );

		const { command, data } = this.decode( message );
		console.log( command, data );

		if ( !this.#handlers.has( command ) ) {
			console.warn( `${ this.#type } - ${ this.uuid }  - has no handler for ${ command }`);
			return;
		}

		const handler = this.#handlers.get( command );
		handler( data );
	}

	ouput ( command, data ) {
		console.log( `ModuleCore - output` );
		
		const message = this.encode( command, data );
		console.log( "output: ", message );

		this.#emit( message );
		/// network output logic
	}

	commandsList ( ) {
		return [ ...this.#commands ];
	}

	get type ( ) {
		return this.#type;
	}

	/// overload in children
	encode ( command, data ) { 
		const message = { command, data };
		return message;
	}

	/// overload in children
	decode ( message ) {
		return message;
	}

	/// overload in children
	delete ( ) {
		/// freeing logic
	};
}