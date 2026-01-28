import ModuleCore from "./ModuleCore.js";

export default class ModuleLambda extends ModuleCore {
	constructor ( uuid ) {
		console.log( `ModuleLambda - constructor - ${ uuid }` );

		super( uuid, "ModuleLambda" );
	}
}