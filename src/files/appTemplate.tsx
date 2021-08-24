
import {
	render,
} from "solid-js/web";

import type {
	Component,
	JSX,
} from "solid-js";

import {
	createSignal,
} from "solid-js";

function _A_createSignal<T>(value: T) {
	const [getter, setter] = createSignal<T>(value);
	return (
		(updateVal?: any) => (
			(typeof updateVal === "undefined")
				? getter()
				: setter(updateVal)
		)
	);
}

const App: Component = () => {
	//@ aster-js-code-here
};

render(() => <App />, document.getElementById("root"));