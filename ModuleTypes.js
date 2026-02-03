import ModuleLambda from "./ModuleLambda.js"
import ModuleCamera from "./ModuleCamera.js"
import ModuleTransform from "./ModuleTransform.js"

const ModuleTypes = {
	ModuleLambda: ModuleLambda,
	ModuleCamera: ModuleCamera,
	ModuleTransform: ModuleTransform,
}

Object.freeze( ModuleTypes );
export default ModuleTypes;

/// ModuleTypes : string -> uint
