# Aster.js

<p style="color:white; background:black; border:1px solid gold; border-radius: .5em; padding: .4em .6em">
<span style="color:gold">⚠</span> This is still in <strong>very</strong> early
development and is not yet intended for public use.
</p>

---

> "The last thing the world needs is another JavaScript framework."
>
> <i> ~ Jeff Delaney, creator of the YouTube channel
> [Fireship](https://www.youtube.com/Fireship), in
> [this video](https://www.youtube.com/watch?v=cuHDQhDhvPE&t=1m15s). </i>

Aster.js is yet another JavaScript framework. But it's completely different from
what you have ever seen before. Instead of having separate sections for your
script, markup and style, the scope of your scripts and styles are coupled to
HTML elements in Aster.js:

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

See [index.aster](./example/index.aster) for an example.

---

## Before you begin:

Make sure you have [Deno](https://deno.land) installed on your system.

Also, install the following npm packages either in your home directory or
`npm init` a node package in the root folder of this repository and install them
there:

- solid-js
- vite
- vite-plugin-solid
- sass

```shell
npm i solid-js vite vite-plugin-solid sass
```

---

## How to start:

If you are on [Windows](https://www.microsoft.com/Windows), simply compile your
Aster.js code by running [`aster.bat`](./aster.bat) with the name of the folder
where your [aster.config.json](./example/aster.config.json) file is located as
the first parameter (Syntax: `aster <name of directory>`). In this case, the
directory is [example](./example/), so the command is:

```shell
aster example
```

You will then find the compiled HTML, CSS and JavaScript files in the
[build](./build/) directory.

If you are on [Linux](https://linux.org/pages/download ""I'd just like to
interject for a moment. What you're refering to as Linux, is in fact, GNU/Linux,
or as I've recently taken to calling it, GNU plus Linux. Linux is not an
operating system unto itself, but rather another free component of a fully
functioning GNU system made useful by the GNU corelibs, shell utilities and
vital system components comprising a full OS as defined by POSIX. Many computer
users run a modified version of the GNU system every day, without realizing it.
Through a peculiar turn of events, the version of GNU which is widely used today
is often called Linux, and many of its users are not aware that it is basically
the GNU system, developed by the GNU Project." ~ Richard Stallman") or
[MacOS](https://www.apple.com/MacOS ""Well, well. Look at the city slicker
pulling up with his fancy Macbook Pro." ~ The people behind Sneedacity"),
solutions will come eventually... probably... maybe...

---

## Syntax:

_[To be added later]_
