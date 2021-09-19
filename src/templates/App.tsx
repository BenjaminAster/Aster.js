
import {
	render as _A_S_render,
	Dynamic as _A_S_Dynamic,
} from "solid-js/web";

import type {
	Component as _A_S_Component,
	JSX as _A_S_JSX,
} from "solid-js";

import {
	createSignal as _A_S_createSignal,
} from "solid-js";

import _A_S_styles from "./[#config.entry].module.scss";

function _A_createSignalVar<T>(value: T) {
	const [getter, setter] = _A_S_createSignal<T>(value);
	return {
		get _() { return getter() },
		set _(updateVal: T) { setter(updateVal) },
	};
}

const _A_App: _A_S_Component = () => {
	// [Begin of code insterted by Aster.js]
	//#-aster-js-code-here
	// [End of code insterted by Aster.js]
};

_A_S_render(() => <_A_App />, document.getElementById("root"));
