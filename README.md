
<!-- 
	IMPORTANT:
	Do not auto-format this file!
	The Markdown formatter of VSCode completely screws up this file
	and does stupid things like replacing a &quot; with a ".
-->

# Aster.js

<p style="color:white; background:black; border:1px solid gold; border-radius: .5em; padding: .4em .6em">
<span style="color:gold">⚠</span> This is still in early
development.
</p>

> "The last thing the world needs is another JavaScript framework."
>
> <i> ~ Jeff Delaney, creator of the YouTube channel
> [Fireship](https://www.youtube.com/Fireship), in
> [this video](https://www.youtube.com/watch?v=cuHDQhDhvPE&t=1m15s). </i>

Aster.js is yet another JavaScript framework. But it's completely different from
what you have ever seen before. Instead of having separate sections for your
script, markup and style, the scope of your scripts and styles are coupled to
HTML elements:


<pre style="tab-size:4; font-family:Consolas,monospace">
&lt;section&gt;
	let $count: number = 0; // &lt;-- TypeScript
	&lt;button onClick={() =&gt; $count++}>Increase counter&lt;/button&gt;
	&lt;ul&gt;
		for (let i = 0; i &lt; $count; i++) {
			&lt;li&gt;This is list item {i} &lt;/li&gt;
		}
	&lt;/ul&gt;
&lt;/section&gt;
</pre>

It compiles your Aster.js code to [Solid.js](https://github.com/solidjs/solid).

See [index.asterjs](./example/index.asterjs) for an example.

## Before you begin:

Make sure you have both [Deno](https://deno.land) and [Node.js](https://nodejs.org) installed on your system.

Also, install the following npm packages in your home directory:

- solid-js
- vite
- vite-plugin-solid
- sass

```shell
npm i solid-js vite vite-plugin-solid sass
```

## Installation:

Run this command from any directory:

```shell
deno run -A https://benjaminaster.github.io/Aster.js/src/install.deno.ts
```

You then have global access to the `asterjs` command.

## Usage:

To compile your Aster.js code, simply run

```shell
asterjs
```
in the folder where your [aster.config.ts](./example/aster.config.ts) file is located.

You will then find the compiled HTML, CSS and JavaScript files in the directory specified as `outDir` in your [aster.config.ts](./example/aster.config.ts) (default is [build](./build/)).

## Syntax:

_[TODO: Add Syntax]_

## For Developers:

_[TODO: Add "For Developers"]_

