
export default {
	entry: "index.asterjs",
	html: "index.html",
	outDir: "./build/",
	// keepAsterjsFolder: true, // doesn't remove the .asterjs folder after compiling has finished
	dev: {
		enabled: true, // enable if you are an asterjs-developer: loads template files from your computer instead of raw.githubusercontent.com
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
