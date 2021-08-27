
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

import styles from "./App.module.scss";

function _A_createSignalVar<T>(value: T) {
	const [getter, setter] = createSignal<T>(value);
	return {
		get _() { return getter() },
		set _(updateVal: T) { setter(updateVal) },
	};
}

const App: Component = () => {
	// [Begin of code insterted by Aster.js]
	//@-aster-js-code-here
	// [End of code insterted by Aster.js]
};

render(() => <App />, document.getElementById("root"));
