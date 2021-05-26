// function randomInt(from, to) {
// 	return Math.trunc(Math.random() * (to - from) + from);
// }

export const CHANNEL_LIST = [
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ'
].map(channel => {
	return {
		name: channel,
		reference: ['M1', 'M2'],
		// data: new Array(1000).fill(1).map(() => randomInt(-100, 100))
	};
});

export const CHANNEL_OPTIONS_SAMPLE = {
	all: [
		{ name: 'M1', reference: [] },
		{ name: 'M2', reference: [] },
		{ name: 'MGFP', reference: [], style: { color: 0xFF0000 } },
		{ name: 'EVENT', reference: [] }
	].concat(CHANNEL_LIST),
	top: [3],
	bottom: [0, 1, 2],
	common: CHANNEL_LIST.map((_, index) => 4 + index)
};
