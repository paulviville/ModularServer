import ModuleCore from "./ModuleCore.js";

const commands = {
	updateTransform: "UPDATE_TRANSFORM",
	updateType: "UPDATE_TYPE",
}

export default class ModulePrimitive extends ModuleCore {
	#data = {
		matrix: new Array( 16 ),
		type: "Box",
	};
	#callbacks = { };

	constructor ( uuid ) {
		console.log( `ModulePrimitive - constructor - uuid: ${ uuid }` );

		super( uuid, "ModulePrimitive" );

		this.addHandler( commands.updateTransform, ( data ) => this.onUpdateTransform( data ) );
		this.addHandler( commands.updateType, ( data ) => this.onUpdateType( data ) );
	}

	setCallbacks ( callbacks = { } ) {
		this.#callbacks = callbacks;
	}

	updateTransform ( matrix, sync = false ) {
		console.log( `ModulePrimitive - updateTransform` );
		console.log( matrix );
		this.#data.matrix = [ ...matrix ];

		this.#callbacks.updateTransform?.( );

		if ( sync ) {
			this.ouput( commands.updateTransform, { matrix: matrix } );
		}
	}

	onUpdateTransform ( data ) {
		console.log( `ModulePrimitive - onUpdateTransform` );

		const { matrix } = data;
		this.updateTransform( matrix );
	}

	updateType ( type, sync = false ) {
		console.log( `ModulePrimitive - updateType` );

		/// add type check
		this.#data.type = type;
		this.#callbacks.updateType?.( );

		if ( sync ) {
			this.ouput( commands.updateTransform, { matrix: matrix } );
		}
	}

	onUpdateType ( data ) {
		console.log( `ModulePrimitive - onUpdateType` );

		const { type } = data;
		this.updateType( type );
	}

	get state ( ) {
		return {
			type: this.#data.type,
			matrix: [ ...this.#data.matrix ],
		};
	}

	set state ( stateData ) {
		console.log( stateData );
		const { type, matrix } = stateData;

		this.updateType( type );
		this.updateTransform( matrix );
	}
}