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
		reference: ['M1', 'M2'],
		data: []
	};
});

const MAX_MICROVOLT = 20000000;
const MIN_MICROVOLT = 2;
const MAX_PIXEL_HEIGHT = 200;
const MIN_PIXEL_HEIGHT = 50;

/**
 *
 * @param {import('pixijs-box/src/Context').Context} context
 * @returns
 */
export default function ContextState(context) {
	const now = Date.now();

	const chart = {
		scroller: { length: 63, start: 0 },
		timeline: { start: now, end: now + 40000 },
		scale: { pixel: 100, microvolt: 1200 }
	};

	const channel = {
		top: [],
		bottom: [],
		list: CHANNEL_LIST,
		timeList: new Array(10000).fill(1).map((_, index) => now + 40 * index),
		maxChannelNumberInView: 0,
		fontSize: 12,
		config: { fontSize: 12, labelWidth: 0, valueWidth: 0 }
	};

	const sampling = { running: false, interval: 2000 };
	let hover = 'global';

	function emitChannelDisplayChange() {
		context.emit('channel-display-change');
	}

	function updateChannelState() {
		channel.maxChannelNumberInView = 30;
		channel.fontSize = 12;
	}

	context.on('scroller-change', emitChannelDisplayChange);
	context.on('channel-config-change', emitChannelDisplayChange);

	return {
		SIZE,
		get hover() {
			return hover;
		},
		set hover(value) {
			hover = value;
		},
		sampling: {
			get running() {
				return sampling.running;
			},
			set running(value) {
				if (sampling.running !== value) {
					const flag = Boolean(value);

					sampling.running = flag;
					context.emit(flag ? 'sampling-on' : 'sampling-off');
				}
			},
			get interval() {
				return sampling.interval;
			},
			set interval(value) {
				if (sampling.interval !== value) {
					sampling.interval = value;
					context.emit('interval-change');
				}
			}
		},
		chart: Object.freeze({
			scroller: Object.freeze({
				get length() {
					return chart.scroller.length;
				},
				set length(value) {
					if (chart.scroller.length !== value) {
						chart.scroller.length = value;
						context.emit('scroller-change');
					}
				},
				get start() {
					return chart.scroller.start;
				},
				set start(value) {
					const start = Math.max(Math.min(value, channel.list.length - chart.scroller.length), 0);

					if (chart.scroller.start !== start) {
						chart.scroller.start = start;
						context.emit('scroller-change');
					}
				},
				get step() {
					return 1;
				}
			}),
			scale: Object.freeze({
				get pixel() {
					return chart.scale.pixel;
				},
				set pixel(value) {
					const fixed = Math.max(Math.min(value, MAX_PIXEL_HEIGHT), MIN_PIXEL_HEIGHT);

					if (chart.scale.pixel !== fixed) {
						chart.scale.pixel = fixed;
						context.emit('scale-pixel-change');
					}
				},
				get microvolt() {
					return chart.scale.microvolt;
				},
				set microvolt(value) {
					const fixed = Math.max(Math.min(value, MAX_MICROVOLT), MIN_MICROVOLT);

					if (chart.scale.microvolt !== fixed) {
						chart.scale.microvolt = fixed;
						context.emit('scale-microvolt-change');
					}
				},
				setMicrovolt(up) {
					const { microvolt } = this;
					let digit = 0;
					let current = Math.abs(microvolt);

					while (current) {
						current = Math.trunc(current / 10);
						digit++;
					}

					const step = !up && microvolt === Math.pow(10, digit - 1)
						? Math.pow(10, digit - 2)
						: Math.pow(10, digit - 1);

					this.microvolt = (Math.trunc(microvolt / step) + (up ? 1 : -1)) * step;
				}
			}),
			timeline: Object.freeze({
				get start() {
					return chart.timeline.start;
				},
				set start(value) {
					if (chart.timeline.start !== value) {
						chart.timeline.start = value;
						context.emit('timeline-change');
					}
				},
				get end() {
					return chart.timeline.end;
				},
				set end(value) {
					if (chart.timeline.end !== value) {
						chart.timeline.end = value;
						context.emit('timeline-change');
					}
				}
			})
		}),
		channel: {
			get list() {
				return channel.list;
			},
			set list(value) {
				channel.list = value;
				context.emit('channel-change');
				updateChannelState();
			},
			get top() {
				return channel.top;
			},
			set top(value) {
				channel.top = value;
				context.emit('channel-change');
				updateChannelState();
			},
			get bottom() {
				return channel.top;
			},
			set bottom(value) {
				channel.bottom = value;
				context.emit('channel-change');
				updateChannelState();
			},
			get display() {
				const { start, length } = chart.scroller;

				return channel.list.slice(start, start + length);
			},
			get timeList() {
				return channel.timeList.slice(0);
			},
			config: {
				fontSize: 12,
				labelWidth: 0,
				valueWidth: 0
			}
		}
	};
}
