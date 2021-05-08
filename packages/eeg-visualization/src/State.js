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

export default function ContextState() {
	const state = {
		chart: {
			scroller: {
				length: 12,
				start: 0,
			}
		},
		channel: {
			top: [],
			bottom: [],
			list: CHANNEL_LIST,
			display: [],
			config: {
				fontSize: 12,
				labelWidth: 0,
				valueWidth: 0
			}
		}
	};

	return {
		SIZE,
		sampling: {
			running: true,
			interval: 10000
		},
		chart: {
			scroller: {
				get length() {
					return state.chart.scroller.length;
				},
				set length(value) {
					state.chart.scroller.length = value;
				},
				get start() {
					return state.chart.scroller.start;
				},
				set start(value) {
					state.chart.scroller.start =
						Math.max(Math.min(value, state.channel.list.length - state.chart.scroller.length), 0);
				},
				get step() {
					return 1;
				}
			},
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
			get list() {
				return state.channel.list;
			},
			set list(value) {
				state.channel.list = value;
			},
			display: [],
			config: {
				fontSize: 12,
				labelWidth: 0,
				valueWidth: 0
			}
		}
	};
}
