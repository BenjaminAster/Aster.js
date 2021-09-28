

export function asterjsParser(code: string) {
	let lines: any[] = (() => {
		let lastStyleTabIndentation = -1;
		let globalIndent: string;

		return code.split("\n").filter(
			(line: string) => line.trim()
		).map((line: string) => {
			let tabIndentation: number = 0;
			if (!globalIndent) {
				globalIndent = line.match(/^(?<indent>(\s+))/)?.groups?.indent as string;
			}
			if (globalIndent) {
				tabIndentation = line.search(/\S/) / globalIndent.length;
			}
			line = line.trim();
			let type = (() => {
				if (tabIndentation < lastStyleTabIndentation) {
					lastStyleTabIndentation = -1;
				}
				if (lastStyleTabIndentation < 0) {
					if (line[0].match(/[\<#]/)) {
						if (line.match(/[^\s]#$/)) {
							line = line.slice(0, -1);
						} else {
							line = `${line}{" "}`;
						}
					}
					if (line.startsWith("<")) {
						return "markup";
					} else if (line.startsWith("#")) {
						line = line.substr(1);
						if (line.startsWith(" ")) {
							line = `{" "}${line}`;
						}
						return "markup";
					} else if (line.startsWith("&")) {
						lastStyleTabIndentation = tabIndentation;
						return "style";
					} else {
						return "script";
					}
				} else {
					return "style";
				}
			})();
			return {
				type,
				tabIndentation,
				line,
			};
		});
	})();

	let allSegmentsArray: any[] = (() => {
		let prevType: string = "script";
		let prevTabIndentation: number = 0;
		let prevIndentation: number = 0;
		let segmentTabIndentation: number = 0;
		let indentation: number = 0;
		let currentLines: any[] = [];
		let returnArray: any[] = [];

		for (let [i, line] of lines.entries()) {
			if (
				prevType === "markup"
				&&
				line.tabIndentation === prevTabIndentation + 1
			) {
				indentation++;
			} else if (
				line.type === "markup"
				&&
				line.tabIndentation + 1 === prevTabIndentation
			) {
				indentation--;
			}

			if (
				(prevType !== line.type)
				||
				(prevIndentation !== indentation)
			) {
				returnArray.push({
					type: prevType,
					indentation: prevIndentation,
					lines: currentLines,
				});
				segmentTabIndentation = line.tabIndentation;
				currentLines = [];
			}
			currentLines.push("\t".repeat(line.tabIndentation - segmentTabIndentation) + line.line);
			if (i >= lines.length - 1) {
				returnArray.push({
					type: line.type,
					indentation,
					lines: currentLines,
				})
			}
			prevTabIndentation = line.tabIndentation;
			prevIndentation = indentation;
			prevType = line.type;
		}

		return returnArray;
	})();

	let codeObject: any = (() => {
		function recursiveSegmentsToBlocks(segments: any[]): any[] {
			let blockIndentation = segments[0].indentation;
			let returnBlock = [];
			let currentMarkupArray: any[] = [];
			let currentBlockArray: any[] = [];

			for (let [i, segment] of segments.entries()) {
				let isInBlock = (segment.indentation === blockIndentation);

				if (isInBlock) {
					if (currentBlockArray.length) {
						const block = recursiveSegmentsToBlocks(currentBlockArray);
						let style = block
							?.filter(({ type }) => type === "style")
							?.[0]?.code
						const styleIndentation = style?.[0]?.search(/\S/);
						style = style?.map(
							(line: string) => line.replace(
								"\t".repeat(styleIndentation),
								"",
							)
						);
						currentMarkupArray.push({
							type: "block",
							array: block,
							style,
						});
						currentBlockArray = [];
					}

					if (segment.type === "markup") {
						currentMarkupArray.push({
							type: "markup",
							code: segment.lines,
						});
					}
					if (
						currentMarkupArray.length
						&&
						(segment.type !== "markup" || i >= segments.length - 1)
					) {
						returnBlock.push({
							type: "markupArray",
							array: currentMarkupArray,
						});
						currentMarkupArray = [];
					}
					if (segment.type !== "markup") {
						returnBlock.push({
							type: segment.type,
							code: segment.lines,
						});
					}
				} else {
					currentBlockArray.push(segment);
				}
			}

			{
				let styleObject = returnBlock.filter(({ type }) => type === "style")[0];

				const globalBegin: number = styleObject?.code?.indexOf("&:global:");
				if (globalBegin >= 0) {
					if (globalBegin === 0) {
						styleObject.type = "globalStyle";
						styleObject.code.shift();
					} else {
						const globalStyle = styleObject.code.splice(globalBegin).slice(1);
						returnBlock.push({
							type: "globalStyle",
							code: globalStyle,
						});
					}
				}
			}

			return returnBlock;
		}

		return recursiveSegmentsToBlocks(allSegmentsArray);
	})();

	// Deno.writeTextFile("./codeObject.json", JSON.stringify(codeObject, null, "\t"));

	return codeObject;
}
