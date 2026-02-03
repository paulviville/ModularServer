const commands = {
	setState: "SET_STATE",
}

export default class ModuleCore {
	#type;
	#uuid;
	#emit;
	#onChangeFn;

	// #needsUpdate = false;
	#handlers = new Map( );

	constructor ( uuid = crypto.randomUUID( ), type = "ModuleCore" ) {
		console.log( `ModuleCore - constructor - ${ uuid } ${ type }` );
		
		this.addHandler( commands.setState, ( state ) => this.state = state );


		this.#uuid = uuid;
		this.#type = type; 
	}

	get uuid ( ) {
		return this.#uuid;
	}

	setOutputFn ( outputFn ) {
		this.#emit = ( message ) => {
			outputFn( this.#uuid, message );
		}
	}

	setOnChange ( onChangeFn ) {
		this.#onChangeFn = onChangeFn;
	}

	onChange ( ) {
		this.#onChangeFn( );
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
		
		// console.log(message)
		const { command, data } = this.decode( message );
		// console.log( command, data );

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

		this.#emit( message );
	}

	commandsList ( ) {
		return [ ...this.#handlers.keys( ) ];
	}

	get type ( ) {
		return this.#type;
	}

	/// overload in children
	/// gives an object/buffer of all data in the module relevant to duplicate it
	get state ( ) {
		return { };
	}

	/// overload in children
	set state ( stateData ) {
		return;
	}

	/// overload in children
	encode ( command, data ) { 
		const message = { command, data };
		return message;
	}

	/// overload in children
	decode ( message ) {
		console.log(message)
		return message;
	}

	/// overload in children
	delete ( ) {
		/// freeing logic
	};
}