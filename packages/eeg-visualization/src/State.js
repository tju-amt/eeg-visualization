const CHANNEL_LIST = [
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ'
].map(channel => {
	return {
		name: channel,
		reference: ['M1', 'M2']
	};
});

export default {
	sampling: true,
	interval: 2000,
	channel: {
		top: [],
		bottom: [],
		list: CHANNEL_LIST,
		config: {
			fontSize: 12,
			labelWidth: 0,
			valueWidth: 0
		}
	}
};
