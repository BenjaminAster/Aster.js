
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

function _A_createSignalVar<T>(value: T) {
	const [getter, setter] = createSignal<T>(value);
	return {
		get _() { return getter() },
		set _(updateVal: T) { setter(updateVal) },
	};
}

const App: Component = () => {
	// [Begin of code insterted by Aster.js]
	
let _A_ElementsArray: JSX.Element[] = [];
const name: string = "world";
let $coolNumber = _A_createSignalVar((() => {
let $coolNumber: number = 16; // <-- this is what the user types in
return $coolNumber; })());
_A_ElementsArray = [..._A_ElementsArray, (<>
<h2>Hello {name}!</h2>
<h5>Click the <code>&lt;ul&gt;</code> below:</h5>
<ul onClick={() => $coolNumber._++}>
{(() => {
let _A_ElementsArray: JSX.Element[] = [];
for (let i = 0; i < $coolNumber._; i++) {
_A_ElementsArray = [..._A_ElementsArray, (<>
<li>
This is the number {i} / {$coolNumber._}.
{(() => {
let _A_ElementsArray: JSX.Element[] = [];
if (i === Math.floor($coolNumber._ / 2)) {
_A_ElementsArray = [..._A_ElementsArray, (<>
{} ({i} is {$coolNumber._ % 2 === 1 && "almost"} half of {$coolNumber._}! 😎)
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
	// [End of code insterted by Aster.js]
};

render(() => <App />, document.getElementById("root"));