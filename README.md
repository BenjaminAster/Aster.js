# Aster.js

<span style=color:gold>⚠ Warning:</span> This is still in **very** early
development and is not yet intended for public use.

---

> "The last thing the world needs is another JavaScript framework."
>
> *~ Jeff Delaney, creator of the YouTube channel
> [Fireship](https://www.youtube.com/Fireship), in
> [this video](https://www.youtube.com/watch?v=cuHDQhDhvPE&t=1m15s).*

I disagree. Aster.js is JavaScript framework completely different from what you have ever
seen before.

It compiles your Aster.js code to [Solid.js](https://github.com/solidjs/solid).

See [test.aster](./code/test.aster) for an example.

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

If you are on Windows, simply compile your Aster.js code by running
[`aster.bat`](./aster.bat) with the name of the folder where your
[aster.config.json](./code/aster.config.json) file is located as the first
parameter (Syntax: `aster <name of directory>`). In this case, the directory is
[code](./code/), so the command is:

```shell
aster code
```

You will then find the compiled HTML, CSS and JavaScript files in the
[build](./build/) directory.

If you are on
<abbr title="&quot;I'd just like to interject for a moment. What you're refering to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. &NewLine;Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called Linux, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project.&quot; &NewLine; ~ Richard Stallman">Linux</abbr>
or MacOS, solutions will come eventually... probably... maybe...

---

## Syntax:

_[To be added later]_


