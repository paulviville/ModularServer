const commands = {
	setState: "SET_STATE",
}

export default class ModuleCore {
	#type;
	#uuid;
	#ownerUUID;
	#emit;
	#onChangeFn;
	#onDeleteFn;

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

	get ownerUUID ( ) {
		return this.#ownerUUID;
	}

	set ownerUUID ( ownerUUID ) {
		this.#ownerUUID = ownerUUID;
	}

	setOutputFn ( outputFn ) {
		this.#emit = ( message ) => {
			outputFn( this.#uuid, message );
		}
	}

	setOnChange ( onChangeFn ) {
		this.#onChangeFn = onChangeFn;
	}

	setOnDelete ( onDeleteFn ) {
		this.#onDeleteFn = onDeleteFn;
	}

	onChange ( ) {
		this.#onChangeFn?.( );
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

	stateCommand ( ) {
		return this.encode ( 
			"SET_STATE",
			this.state
		);
	}

	/// overload in children 
	/// PLACEHOLDER FOR SWITCH TO BUFFERS
	encode ( command, data ) { 
		const message = { command, data: data };
		return message;
	}

	/// overload in children
	/// PLACEHOLDER FOR SWITCH TO BUFFERS
	decode ( message ) {
		console.log(message)
		return message;
	}

	delete ( ) {
		this.#onDeleteFn?.( );
	};
}