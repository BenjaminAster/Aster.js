

export function asterParser(code: string) {
	let lines: any[] = (() => {
		let lastStyleTabIndentation = -1;

		return code.split("\n").filter(
			(line: string) => line.trim()
		).map((line: string) => {
			let tabIndentation: number = line.search(/[^\t]/);
			line = line.trim();
			let type = (() => {
				if (tabIndentation < lastStyleTabIndentation) {
					lastStyleTabIndentation = -1;
				}
				if (lastStyleTabIndentation < 0) {
					if (line.startsWith("<")) {
						return "markup";
					} else if (line.startsWith("#")) {
						line = line.substr(1);
						if (line.startsWith(" ")) {
							line = `{" "}${line}`;
						}
						if (line.endsWith(" #")) {
							line = `${line.slice(0, -1)}{" "}`;
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
				currentLines = [];
			}
			currentLines.push(line.line);
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
			let prevIsInBlock = true;
			let returnBlock = [];
			let currentMarkupArray: any[] = [];
			let currentBlockArray: any[] = [];

			for (let [i, segment] of segments.entries()) {
				let isInBlock = (segment.indentation === blockIndentation);

				if (isInBlock) {
					if (currentBlockArray.length) {
						const block = recursiveSegmentsToBlocks(currentBlockArray);
						let style = block.filter(({type}) => type === "style")?.[0]?.code;
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

				prevIsInBlock = isInBlock;
			}

			return returnBlock;
		}

		return recursiveSegmentsToBlocks(allSegmentsArray);
	})();

	Deno.writeTextFile("./test.json", JSON.stringify(codeObject, null, "\t"));

	// console.log(JSON.stringify(codeObject, null, "\t"));

	return codeObject;
}
