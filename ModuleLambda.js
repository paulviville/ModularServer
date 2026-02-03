import ModuleCore from "./ModuleCore.js";

export default class ModuleLambda extends ModuleCore {
	// #data 

	constructor ( uuid ) {
		console.log( `ModuleLambda - constructor - ${ uuid }` );

		super( uuid, "ModuleLambda" );
	}
}