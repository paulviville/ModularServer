import ModuleCore from "./ModuleCore.js";
import ModuleTypes from "./ModuleTypes.js";

const commands = {
	setState: "SET_STATE",
	addModule: "ADD_MODULE",
	removeModule: "REMOVE_MODULE",
}

export default class ModulesManager extends ModuleCore {
	#modules = new Map ( );
	#outputFn;

	constructor ( network, outputFn ) {
		console.log( `ModulesManager - constructor` );

		const uuid = "00000000-0000-0000-0000-000000000000";
		super ( uuid, "ModulesManager" );

		this.#outputFn = outputFn;
		this.setOutputFn( outputFn );

		this.addHandler( commands.addModule, ( data ) => this.onAddModule( data ) );
		this.addHandler( commands.removeModule, ( data ) => this.onRemoveModule( data ) );



		this.#modules.set( uuid, this );
	}

	onAddModule ( data ) {
		console.log( `ModulesManager - onAddModule` );

		console.log( data );
		const { type, uuid, ...moduleData } = data;
		this.addModule( type, uuid );
	}

	onRemoveModule ( data ) {
		console.log( `ModulesManager - onRemoveModule` );

		console.log( data );
		const { uuid } = data;
		console.log( uuid );
		this.removeModule( uuid )
	}

	addModule ( type, uuid, sync = false ) { 
		console.log( `ModulesManager - addModule` );

		const constructor = ModuleTypes[ type ];
		/// check if constuctor undefined
		const module = new constructor( uuid );
		module.setOutputFn( this.#outputFn );

		/// if uuid is undefined, module.uuid isn't
		this.#modules.set( module.uuid, module );
		console.log(this.#modules)


		if ( sync ) {
			this.ouput( commands.addModule, { type: type, uuid: module.uuid } );
		}
	}

	removeModule ( uuid, sync = false ) {
		console.log( `ModulesManager - removeModule` );

		if ( this.#modules.has( uuid ) ) {
			const module = this.#modules.get( uuid );
			module.delete( );

			this.#modules.delete( uuid );

			if ( sync ) {
				this.ouput( commands.removeModule, { uuid: uuid } );
			}
		}
	}

	get modules ( ) {
		return this.#modules;
	}

	get modulesList ( ) {
		return [ ...this.#modules.keys( ) ];
	}

	get state ( ) {
		const modulesData = [];
		for ( const [uuid, module] of this.#modules ) {
			if ( module.type == "ModulesManager" ) 
				continue;

			modulesData.push( { uuid, type: module.type } );
		}

		return {
			modules: modulesData
		}
	}

	set state ( state ) {
		console.log( state );
		for( const moduleInfo of state.modules ) {
			console.log( moduleInfo.uuid, moduleInfo.type );
			this.addModule( moduleInfo.type, moduleInfo.uuid );
		}
	}
}