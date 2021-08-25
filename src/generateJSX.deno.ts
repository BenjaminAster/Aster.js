
import {
	createApp,
} from "./createApp.deno.ts";

export async function generateJSX() {

	const jsx = (() => {
		const codesArray: any = [
			{
				type: "script",
				code: [
					`const name: string = "world";`,
					`let $coolNumber = _A_createSignalVar((() => {`,
					`let $coolNumber: number = 16; // <-- this is what the user types in`,
					`return $coolNumber; })());`,
				].join("\n"),
			},
			{
				type: "markupArray",
				array: [
					{
						type: "markup",
						code: [
							`<h2>Hello {name}!</h2>`,
							`<h5>Click the <code>&lt;ul&gt;</code> below:</h5>`,
							`<ul onClick={() => $coolNumber._++}>`,
						].join("\n"),
					},
					{
						type: "block",
						array: [
							{
								type: "script",
								code: [
									`for (let i = 0; i < $coolNumber._; i++) {`,
								].join("\n"),
							},
							{
								type: "markupArray",
								array: [
									{
										type: "markup",
										code: [
											`<li>`,
											`This is the number {i} / {$coolNumber._}.`,
										].join("\n"),
									},
									{
										type: "block",
										array: [
											{
												type: "script",
												code: [
													`if (i === Math.floor($coolNumber._ / 2)) {`
												].join("\n"),
											},
											{
												type: "markup",
												code: [
													`{} ({i} is {$coolNumber._ % 2 === 1 && "almost"} half of {$coolNumber._}! 😎)`,
												].join("\n"),
											},
											{
												type: "script",
												code: [
													`}`
												].join("\n"),
											},
										],
									},
									{
										type: "markup",
										code: [
											`</li>`,
										].join("\n"),
									},
								],
							},
							{
								type: "script",
								code: [
									`}`,
								].join("\n"),
							},
						],
					},
					{
						type: "markup",
						code: [
							`</ul>`,
						].join("\n"),
					},
				],
			},
			{
				type: "markup",
				code: [
					`<h5>It works...?</h5>`,
				].join("\n"),
			},
			{
				type: "script",
				code: [
					`console.log("If you see this in your console, it might have worked!");`,
				].join("\n"),
			},
		];

		function recursiveBlocks(codesArray: any) {
			let codeSegments: string[] = [
				`let _A_ElementsArray: JSX.Element[] = [];`,
			];

			for (let segment of codesArray) {
				switch (segment.type) {
					case ("script"): {
						codeSegments.push(segment.code);
						break;
					}
					case ("markup"): {
						codeSegments.push([
							`_A_ElementsArray = [..._A_ElementsArray, (<>`,
							segment.code,
							`</>)];`,
						].join("\n"));
						break;
					}
					case ("markupArray"): {
						codeSegments.push([
							`_A_ElementsArray = [..._A_ElementsArray, (<>`,
							...segment.array.map((markupSegment: any) => {
								switch (markupSegment.type) {
									case ("markup"): {
										return markupSegment.code;
									}
									case ("block"): {
										return (
											[
												`{(() => {`,
												recursiveBlocks(markupSegment.array),
												`})}`,
											].join("\n")
										);
									}
								}
							}),
							`</>)];`
						].join("\n"));
						break;
					}
				}
			}

			codeSegments.push(`return _A_ElementsArray;`);
			return codeSegments.join("\n");
		}

		return [
			``,
			recursiveBlocks(codesArray),
		].join("\n");
	})();

	await createApp(jsx);
}
