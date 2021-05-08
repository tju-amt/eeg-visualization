import { SIZE } from './constant';

const CHANNEL_LIST = [
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ',
	'FP1', 'FPZ', 'FP2'
].map(channel => {
	return {
		name: channel,
		reference: ['M1', 'M2']
	};
});

export default {
	SIZE,
	sampling: {
		running: true,
		interval: 10000
	},
	chart: {
		scale: {
			pixel: 200,
			microvolt: 5
		},
		timeline: {
			start: Date.now(),
			end: Date.now() + 10000
		}
	},
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
