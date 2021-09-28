
export default {
	entry: "index.aster",
	html: "index.html",
	outDir: "../build/",
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
