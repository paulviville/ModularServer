import ModuleCore from "./ModuleCore.js";

const commandsCamera = {
	updateCamera: "UPDATE_CAMERA",
}

export default class ModuleCamera extends ModuleCore {

	constructor ( id ) {
		console.log( `ModuleCamera - constructor - id: ${ id }` );

		super( id );
		this.addCommandHandler( commandsCamera.updateCamera, ( data ) => this.onUpdateCamera( data ) );
	}


}