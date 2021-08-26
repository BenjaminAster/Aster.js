

// this will be replaced by a parsed code object in the future

export const testCodeObject: any = [
	{
		type: "script",
		code: [
			`const name: string = "world";`,
			`let $coolNumber: number = 16;`,
			`let $lastClickedLine: number = -1;`,
			`console.log($coolNumber, $lastClickedLine);`,
		],
	},
	{
		type: "markupArray",
		array: [
			{
				type: "markup",
				code: [
					`<h2>Hello {name}!</h2>`,
					`<h5>`,
					`	Click the <code>&lt;ul&gt;</code> below`,
				],
			},
			{
				type: "block",
				array: [
					{
						type: "script",
						code: [
							`if ($lastClickedLine >= 0) {`,
						],
					},
					{
						type: "markupArray",
						array: [
							{
								type: "markup",
								code: [
									`{} (Your last clicked line is {$lastClickedLine})`,
								],
							},
						],
					},
					{
						type: "script",
						code: [
							`}`,
						],
					},
				]
			},
			{
				type: "markup",
				code: [
					`</h5>`,
					`<button onClick={() => $coolNumber--}> remove 1 line </button>`,
					`<ul onClick={() => $coolNumber++}>`,
				],
			},
			{
				type: "block",
				array: [
					{
						type: "script",
						code: [
							`for (let i = 0; i < $coolNumber; i++) {`,
						],
					},
					{
						type: "markupArray",
						array: [
							{
								type: "markup",
								code: [
									`<li onClick={() => $lastClickedLine = i}>`,
									`This is the number {i} / {$coolNumber}.`,
								],
							},
							{
								type: "block",
								array: [
									{
										type: "script",
										code: [
											`if (i === Math.floor($coolNumber / 2)) {`,
										],
									},
									{
										type: "markupArray",
										array: [
											{
												type: "markup",
												code: [
													`{} ({i} is {$coolNumber % 2 === 1 && "almost"} half of {$coolNumber}! 😎)`,
												],
											},
										],
									},
									{
										type: "script",
										code: [
											`}`,
										],
									},
								],
							},
							{
								type: "markup",
								code: [
									`</li>`,
								],
							},
						],
					},
					{
						type: "script",
						code: [
							`}`,
						],
					},
				],
			},
			{
				type: "markup",
				code: [
					`</ul>`,
				],
			},
		],
	},
	{
		type: "script",
		code: [
			`let $counter: number = 0;`,
		],
	},
	{
		type: "markupArray",
		array: [
			{
				type: "markup",
				code: [
					`<button onClick={() => $counter++}> &nbsp; + &nbsp; </button>`,
					`{" "} Counter: <tt style="font-size: 1.3em;"> {$counter} </tt> {" "}`,
					`<button onClick={() => $counter--}> &nbsp; - &nbsp; </button>`,
				],
			},
		],
	},
	{
		type: "script",
		code: [
			`console.log("If you see this in your console, it might have worked!");`,
		],
	},
];
