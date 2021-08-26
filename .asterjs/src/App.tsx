
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
let $coolNumber: number = 16;
return $coolNumber; })());
let $lastClickedLine = _A_createSignalVar((() => {
let $lastClickedLine: number = -1;
return $lastClickedLine; })());
console.log($coolNumber._, $lastClickedLine._);
_A_ElementsArray.push(<>
<h2>Hello {name}!</h2>
<h5>
	Click the <code>&lt;ul&gt;</code> below
{() => {
let _A_ElementsArray: JSX.Element[] = [];
if ($lastClickedLine._ >= 0) {
_A_ElementsArray.push(<>
{} (Your last clicked line is {$lastClickedLine._})
</>);
}
return _A_ElementsArray;
}}
</h5>
<button onClick={() => $coolNumber._--}> remove 1 line </button>
<ul onClick={() => $coolNumber._++}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
for (let i = 0; i < $coolNumber._; i++) {
_A_ElementsArray.push(<>
<li onClick={() => $lastClickedLine._ = i}>
This is the number {i} / {$coolNumber._}.
{() => {
let _A_ElementsArray: JSX.Element[] = [];
if (i === Math.floor($coolNumber._ / 2)) {
_A_ElementsArray.push(<>
{} ({i} is {$coolNumber._ % 2 === 1 && "almost"} half of {$coolNumber._}! 😎)
</>);
}
return _A_ElementsArray;
}}
</li>
</>);
}
return _A_ElementsArray;
}}
</ul>
</>);
let $counter = _A_createSignalVar((() => {
let $counter: number = 0;
return $counter; })());
_A_ElementsArray.push(<>
<button onClick={() => $counter._++}> &nbsp; + &nbsp; </button>
{" "} Counter: <tt style="font-size: 1.3em;"> {$counter._} </tt> {" "}
<button onClick={() => $counter._--}> &nbsp; - &nbsp; </button>
</>);
console.log("If you see this in your console, it might have worked!");
return _A_ElementsArray;

	// [End of code insterted by Aster.js]
};

render(() => <App />, document.getElementById("root"));