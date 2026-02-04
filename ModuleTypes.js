import ModuleLambda from "./ModuleLambda.js"
import ModuleCamera from "./ModuleCamera.js"
import ModuleTransform from "./ModuleTransform.js"
import ModuleText from "./ModuleText.js"

const ModuleTypes = {
	ModuleLambda: ModuleLambda,
	ModuleCamera: ModuleCamera,
	ModuleTransform: ModuleTransform,
	ModuleText: ModuleText,
}

Object.freeze( ModuleTypes );
export default ModuleTypes;

/// ModuleTypes : string -> uint
