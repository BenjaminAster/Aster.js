
export const sleep = async (ms: number): Promise<void> => {
	return new Promise((resolve: () => void) => {
		globalThis.setTimeout(resolve, ms);
	});
};
