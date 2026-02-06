import ModuleCore from "./ModuleCore.js";

const commands = {
	updateCamera: "UPDATE_CAMERA",
}

export default class ModuleCamera extends ModuleCore {
	#data = {
		matrix: new Array( 16 ),
	};

	constructor ( uuid ) {
		console.log( `ModuleCamera - constructor - uuid: ${ uuid }` );

		super( uuid, "ModuleCamera" );
		this.addHandler( commands.updateCamera, ( data ) => this.onUpdateCamera( data ) );
	}

	updateCamera ( matrix, sync = false ) {
		console.log( `ModuleCamera - updateCamera` );
		console.log( matrix );
		this.#data.matrix = [ ...matrix ];

		if ( sync ) {
			this.ouput( commands.updateCamera, { matrix: matrix } );
		}
	}

	onUpdateCamera ( data ) {
		console.log( `ModuleCamera - onUpdateCamera` );

		const { matrix } = data;
		this.updateCamera( matrix );

		this.onChange( );
	}

	get state ( ) {
		return {
			matrix: [ ...this.#data.matrix ],
		};
	}

	set state ( stateData ) {
		console.log( stateData );

		const { matrix } = stateData;
		this.updateCamera( matrix );
	}
}