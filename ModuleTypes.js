import ModuleLambda from "./ModuleLambda.js"
import ModuleCamera from "./ModuleCamera.js"
import ModuleTransform from "./ModuleTransform.js"
import ModuleText from "./ModuleText.js"
import ModulePrimitive from "./ModulePrimitive.js"

const ModuleTypes = {
	ModuleLambda: ModuleLambda,
	ModuleCamera: ModuleCamera,
	ModuleTransform: ModuleTransform,
	ModuleText: ModuleText,
	ModulePrimitive: ModulePrimitive,
}

Object.freeze( ModuleTypes );
export default ModuleTypes;

/// ModuleTypes : string -> uint
