
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		solidPlugin(),
	],
	//[#`...${JSON.stringify(config.vite, null, "\t").replaceAll("\n", "\n\t")}`],
});
