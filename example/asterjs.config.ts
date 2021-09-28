
export default {
	entry: "index.aster",
	html: "index.html",
	outDir: "./build",
	// removeAsterjsFolder: true, // remove the .asterjs folder after compiling has finished
	dev: {
		enabled: true, // enable if you are an asterjs-developer: loads template files from raw.githubusercontent.com instead of your computer
		templatesDir: "../src/templates", // mandatory if dev.enabled is true
	},
	vite: { // will be passed on to the vite.config.ts file
		// envPrefix: "VITE_",
		logLevel: "info",
		build: {
			// minify: true,
			sourcemap: false,
		},
		css: {
			preprocessorOptions: {
				scss: {},
			},
		},
	},
};
