
const CHANNEL = {
	FONT_SIZE: { MAX: 20, MIN: 8 },
	FONT_RATIO: 0.6,
	GROUP_INTERVAL: 10,
	SPACE_NUMBER: 1,
};

export function computeChannelConfig(height, list, top, bottom) {
	const state = {
		length: list.length,
		maxName: 0,
		maxReference: 0
	};

	list.forEach(channel => {
		state.maxName = Math.max(channel.name.length, state.maxName);
		state.maxReference = Math.max(channel.reference.join(',').length, state.maxReference);
	});

	const allChannelHeight = height -
		(top.length === 0 ? 0 : CHANNEL.GROUP_INTERVAL) -
		(bottom.length === 0 ? 0 : CHANNEL.GROUP_INTERVAL);

	const fontSize = Math.max(
		Math.min(Math.trunc(allChannelHeight / state.length), CHANNEL.FONT_SIZE.MAX),
		CHANNEL.FONT_SIZE.MIN
	);

	return {
		fontSize,
		maxNameLength: state.maxName,
		labelWidth: Math.ceil(
			(state.maxName + state.maxReference + CHANNEL.SPACE_NUMBER) *
			fontSize * CHANNEL.FONT_RATIO
		),
		valueWidth: Math.ceil(fontSize * 6  * CHANNEL.FONT_RATIO)
	};
}