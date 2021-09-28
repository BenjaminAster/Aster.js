
export const sleep = async (ms?: number): Promise<void> => new Promise(
	(resolve: () => void) => globalThis.setTimeout(resolve, ms)
);
