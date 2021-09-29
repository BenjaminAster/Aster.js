
import {
	render as _A_S_render,
	hydrate as _A_S_hydrate,
	renderToString as _A_S_renderToString,
	generateHydrationScript as _A_S_generateHydrationScript,
	Dynamic as _A_S_Dynamic,
} from "solid-js/web";

import type {
	Component as _A_S_Component,
	JSX as _A_S_JSX,
} from "solid-js";

import {
	createSignal as _A_S_createSignal,
} from "solid-js";

import _A_S_styles from "[#config.entry].module.scss";

function _A_createSignalVar<T>(value: T) {
	const [getter, setter] = _A_S_createSignal<T>(value);
	return {
		get _() { return getter() },
		set _(updateVal: T) { setter(updateVal) },
	};
}

const root = document.querySelector("#root");

const _A_App: _A_S_Component = () => {
	// [Begin of code insterted by Aster.js]
	//#asterjs-code-here
	// [End of code insterted by Aster.js]
};

_A_S_render(() => <_A_App />, root);
