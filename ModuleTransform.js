import ModuleCore from "./ModuleCore.js";

const commands = {
	updateTransform: "UPDATE_TRANSFORM",
}

export default class ModuleTransform extends ModuleCore {
	#data = {
		matrix: new Array( 16 ),
	};

	constructor ( uuid ) {
		console.log( `ModuleTransform - constructor - uuid: ${ uuid }` );

		super( uuid, "ModuleTransform" );
		this.addHandler( commands.updateTransform, ( data ) => this.onUpdateTransform( data ) );
	}

	updateTransform ( matrix, sync = false ) {
		console.log( `ModuleTransform - updateTransform` );
		console.log( matrix );
		this.#data.matrix = [ ...matrix ];

		if ( sync ) {
			this.ouput( commands.updateTransform, { matrix: matrix } );
		}
	}

	onUpdateTransform ( data ) {
		console.log( `ModuleTransform - onUpdateTransform` );

		const { matrix } = data;
		this.updateTransform( matrix );

		this.onChange( );
	}

	get state ( ) {
		return {
			matrix: [ ...this.#data.matrix ],
		};
	}

	set state ( stateData ) {
		console.log( stateData );

		this.#data.matrix = [ ...stateData.matrix ];
	}
}