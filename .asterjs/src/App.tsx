
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
	let _A_ElementsArray: JSX.Element[] = [];
const name: string = "world";
let coolNumber = _A_createSignal(16);
_A_ElementsArray = [..._A_ElementsArray, (<>
<h2>Hello {name}!</h2>
<h5>Click the <code>&lt;ul&gt;</code> below:</h5>
<ul onClick={() => coolNumber(_ => ++_)}>
{(() => {
let _A_ElementsArray: JSX.Element[] = [];
for (let i = 0; i < coolNumber(); i++) {
_A_ElementsArray = [..._A_ElementsArray, (<>
<li>
This is the number {i} / {coolNumber()}.
{(() => {
let _A_ElementsArray: JSX.Element[] = [];
if (i === Math.floor(coolNumber() / 2)) {
_A_ElementsArray = [..._A_ElementsArray, (<>
{" "}({i} is the half of {coolNumber()}! 😎)
</>)];
}
return _A_ElementsArray;
})}
</li>
</>)];
}
return _A_ElementsArray;
})}
</ul>
</>)];
_A_ElementsArray = [..._A_ElementsArray, (<>
<h5>It works...?</h5>
</>)];
console.log("If you see this in your console, it might have worked!");
return _A_ElementsArray;
};

render(() => <App />, document.getElementById("root"));