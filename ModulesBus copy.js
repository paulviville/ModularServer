export default class ModulesBus {
	#uuid;
	#modules = new Map( ); /// uuid -> module

	constructor ( uuid ) {
		console.log( `ModulesBus - constructor` );
		
		this.#uuid = uuid ?? crypto.randomUUID( );
	}

	registerModule ( module ) {

	}

	unregisterModule ( module ) {
		
	}
}