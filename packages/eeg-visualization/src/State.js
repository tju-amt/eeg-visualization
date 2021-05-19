import { SIZE } from './constant';

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
		common: [],
		timeList: new Array(10000).fill(1).map((_, index) => now + 40 * index),
	};

	const sampling = { running: false, span: 2000 };
	let hover = 'global';

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
			get span() {
				return sampling.span;
			},
			set span(value) {
				if (sampling.span !== value) {
					sampling.span = value;
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
					const start = Math.max(Math.min(value, channel.common.length - chart.scroller.length), 0);

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
			get common() {
				return channel.common;
			},
			get top() {
				return channel.top;
			},
			get bottom() {
				return channel.bottom;
			},
			// get display() {
			// 	const { start, length } = chart.scroller;

			// 	return channel.common.slice(start, start + length);
			// },
			get timeList() {
				return channel.timeList.slice(0);
			},
			get options() {
				function clone(channel) {
					return {
						name: channel.name,
						reference: channel.reference.slice(0)
					};
				}

				return {
					top: channel.top.map(clone),
					bottom: channel.bottom.map(clone),
					common: channel.common.map(clone)
				};
			},
			setup(options) {
				const { top, bottom, common } = options;

				function createChannel(channelOptions) {
					return {
						name: channelOptions.name,
						reference: channelOptions.reference,
						data: []
					};
				}

				channel.top = top.map(createChannel);
				channel.bottom = bottom.map(createChannel);
				channel.common = common.map(createChannel);

				context.emit('channel-change');
			}
		}
	};
}
