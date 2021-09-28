
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

import _A_S_styles from "./index.aster.module.scss";

function _A_createSignalVar<T>(value: T) {
	const [getter, setter] = _A_S_createSignal<T>(value);
	return {
		get _() { return getter() },
		set _(updateVal: T) { setter(updateVal) },
	};
}

const root = document.querySelector("#root");

const _A_App: _A_S_Component = () => {
	// root.innerHTML = "";

	// [Begin of code insterted by Aster.js]
	
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<section class={_A_S_styles["_A_7"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
let $counter = _A_createSignalVar((() => { let $counter: number = 0; return $counter; })());
_A_ElementsArray.push(<>
<button onClick={() => $counter._++}> + </button>
{" "} Counter: {$counter._} {" "}
<button onClick={() => $counter._--}> - </button>
</>);
return _A_ElementsArray;
}}
</section>
<main class={_A_S_styles["_A_6"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
let $coolNum = _A_createSignalVar((() => { let $coolNum: number = 30; return $coolNum; })()); // Put a "$" in front of your variable to make it reactive
_A_ElementsArray.push(<>
<>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
let name: string = "world"; // This variable is not reactive (The UI won't change if the variable changes.)
_A_ElementsArray.push(<>
<>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
for (let i = 0; i < $coolNum._; i++) {
	for (let j = 0; j < i; j++) {
		if (true) {
			// console.log(`${i} - ${j}`);
		}
	}
}
return _A_ElementsArray;
}}
</>
<section>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<article>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<div>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<strong>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<span>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
{" "} test
</>);
return _A_ElementsArray;
}}
</span>
</>);
return _A_ElementsArray;
}}
</strong>
</>);
return _A_ElementsArray;
}}
</div>
</>);
return _A_ElementsArray;
}}
</article>
</>);
return _A_ElementsArray;
}}
</section>
<section>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<h1>Hello {name}, the number is {$coolNum._} ({$coolNum._}).</h1>
<h2 class={_A_S_styles["_A_5"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
const wikipediaHTML: string = "https://en.wikipedia.org/wiki/HTML";
const HTLMStartChars: string[] = ["<", "#"];
_A_ElementsArray.push(<>
{" "} If a line starts with <code>{HTLMStartChars[0]}</code> or <code>{HTLMStartChars[1]}</code>,
{" "} the line is interpreted as <a href={wikipediaHTML}>HTML</a>.
</>);
return _A_ElementsArray;
}}
</h2>
<h3 class={_A_S_styles["_A_4"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
const possible: boolean = true;
_A_ElementsArray.push(<>
{" "} This is <u class={"test testtest".split(" ").map((_A_className: string) => _A_S_styles[_A_className]).join(" ")}>{possible ? "also" : "not"} possible</u>.
</>);
return _A_ElementsArray;
}}
</h3>
<h4>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
const possible: boolean = true;
_A_ElementsArray.push(<>
<u>And this</u> is
</>);
if (possible) {
	// if statements, for loops etc. work just like in TypeScript.
	// This will be inserted as HTML into the <h4> only if "possible" is true:
_A_ElementsArray.push(<>
{" "} possible, too!
</>);
} else {
_A_ElementsArray.push(<>
{" "} not possible.
</>);
}
_A_ElementsArray.push(<>
{" "} You can switch between HTML and TypeScript
</>);
const howOften: number = Infinity;
_A_ElementsArray.push(<>
{" "} {howOften === Infinity ? "as often as you like" : `${howOften} times`}.
</>);
return _A_ElementsArray;
}}
</h4>
<div class={_A_S_styles["_A_3"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
<p>Please click the button below:</p>
</>);
let $buttonClicked = _A_createSignalVar((() => { let $buttonClicked: boolean = false; return $buttonClicked; })());
_A_ElementsArray.push(<>
<button onClick={() => {$coolNum._++; $buttonClicked._ = true;}} class={_A_S_styles["_A_2"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
{" "} Click me!
</>);
return _A_ElementsArray;
}}
</button>
<>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
if ($buttonClicked._) {
_A_ElementsArray.push(<>
{" "} {" "}
<button onClick={() => $coolNum._--} class={_A_S_styles["_A_1"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
{" "} Remove a line
</>);
return _A_ElementsArray;
}}
</button>
</>);
}
return _A_ElementsArray;
}}
</>
<ul class={_A_S_styles["_A_0"]}>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
for (let i = 0; i < $coolNum._; i++) {
_A_ElementsArray.push(<>
<li>
{() => {
let _A_ElementsArray: JSX.Element[] = [];
_A_ElementsArray.push(<>
{" "} {i} is a cool number!
</>);
if (i % 10 === 0) {
_A_ElementsArray.push(<>
{" "} ({i} a multiple of 10!)
</>);
}
if (i === 16) {
_A_ElementsArray.push(<>
{" "} (16 is my favorite number!)
</>);
}
const flooredHalf: number = Math.floor($coolNum._ / 2);
if (i === flooredHalf) {
_A_ElementsArray.push(<>
{" "} <span> &mdash; </span> {i} is
</>);
if ($coolNum._ % 2) {
_A_ElementsArray.push(<>
{" "} (almost)
</>);
}
_A_ElementsArray.push(<>
{" "} half of {$coolNum._}
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
return _A_ElementsArray;
}}
</div>
</>);
return _A_ElementsArray;
}}
</section>
</>);
return _A_ElementsArray;
}}
</>
</>);
return _A_ElementsArray;
}}
</main>
</>);
return _A_ElementsArray;

	// [End of code insterted by Aster.js]
};

_A_S_render(() => <_A_App />, root)

// const a = _A_S_renderToString(() => <_A_App />);
// const b = _A_S_generateHydrationScript();

// console.log({ a, b });

// console.log(
// 	_A_S_renderToString(
// 		() => <_A_App />,
// 		{

// 		}
// 	)
// );


