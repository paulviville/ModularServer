import ModuleCore from "./ModuleCore.js";

const commands = {
	updateText: "UPDATE_TEXT",
}

export default class ModuleText extends ModuleCore {
	#data = {
		text: "<string>",
	};

	constructor ( uuid ) {
		console.log( `ModuleText - constructor - uuid: ${ uuid }` );

		super( uuid, "ModuleText" );
		this.addHandler( commands.updateText, ( data ) => this.onUpdateText( data ) );
		this.setOnChange( () => { console.log( this.#data.text ) } );
	}

	updateText ( text, sync = false ) {
		console.log( `ModuleText - updateText` );
		console.log( text );
		this.#data.text = text;

		if ( sync ) {
			this.ouput( commands.updateText, { text: text } );
		}
	}

	onUpdateText ( data ) {
		console.log( `ModuleText - onUpdateText` );

		const { text } = data;
		this.updateText( text );

		this.onChange( ); /// this.onChange?.() optimization or pointless?
	}

	get state ( ) {
		return {
			text: this.#data.text,
		};
	}

	set state ( stateData ) {
		console.log( stateData );

		this.#data.text = stateData.text;
	}
}