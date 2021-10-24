
const config: any = {
	entry: "index.asterjs",
	html: "index.html",
	outDir: "build",
	keepAsterjsFolder: true, // doesn't remove the .asterjs folder after compiling has finished
	viteLog: true,
	vite: { // will be passed on to the vite.config.ts file
		build: {
		},
	},
};

export default config;
