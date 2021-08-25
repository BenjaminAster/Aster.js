
export async function createApp(code: string) {
	await createAppFile(code);

	await viteBuild();
}

async function createAppFile(solidJsCode: string) {
	let code = await Deno.readTextFile(`./src/files/appTemplate.tsx`);
	code = code.replace(`//@-aster-js-code-here`, solidJsCode);

	await Deno.writeTextFile(`./.asterjs/src/App.tsx`, code);
}

async function viteBuild() {
	await Deno.run({
		cmd: ["./src/files/vite-build.cmd"],
	}).status();
}