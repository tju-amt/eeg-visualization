import { Viewport, assembly } from 'pixijs-box';

import * as Title from './src/Element/Title';
import * as Monitor from './src/Element/Monitor';
import * as Navigator from './src/Element/Navigator';

const ALL_ELEMENT_CLASS = Object.assign({}, Title, Monitor, Navigator);

import baseState from './src/State';
import { computeChannelConfig } from './src/utils';

import layout from './src/layout';

export default function EegVisualization() {
	const viewport = new Viewport();
	const { context } = viewport;

	window.c = viewport.context;

	Object.assign(context.state, baseState);

	function updateLabelConfig() {
		const { channel } = context.state;

		channel.config = computeChannelConfig(
			boxMap.label.height,
			channel.list,
			channel.top,
			channel.bottom
		);

		context.emit('channel-config-change');
	}

	context.on('mounted', function install() {
		context.watch((context, scope) => {
			const { running } = context.state.sampling;

			if (running !== scope.running) {
				scope.running = running;
				context.emit(scope.running ? 'sampling-on' : 'sampling-off');
			}
		}, { running: null });

		context.watch((context, scope) => {
			if (context.state.interval !== scope.interval) {
				scope.interval = context.state.interval;
				context.emit('interval-change');
			}
		}, { interval: null });

		context.watch((context, scope) => {
			const { list, top, bottom } = context.state.channel;

			if (
				list !== scope.list ||
				top !== scope.top ||
				bottom !== scope.bottom
			) {
				scope.list = list;
				scope.top = top;
				scope.bottom = bottom;
				context.emit('channel-change');
				updateLabelConfig();
			}
		}, { list: [], top: [], bottom: [] });

		context.watch((context, scope) => {
			const { timeline } = context.state.chart;

			if (timeline.start !== scope.start || timeline.end !== scope.end) {
				scope.start = timeline.start;
				scope.end = timeline.end;
				context.emit('timeline-change');
			}
		}, { start: null, end: null });

		context.on('resize', updateLabelConfig);

		let samplingWatcherId = null;

		context
			.on('sampling-off', () => context.unwatch(samplingWatcherId))
			.on('sampling-on', () => {
				const { state } = context;

				context.watch((_c, scope, now) => {
					const { interval } = state.sampling;

					if (now > scope.end || scope.interval !== interval) {
						state.chart.timeline.start = now;
						state.chart.timeline.end = scope.end = now + interval;
						scope.interval = interval;
					}
				}, { end: 0, interval: null });
			});
	});

	const boxMap = assembly(ALL_ELEMENT_CLASS, layout, viewport);

	return {
		install(element) {
			viewport.mount(element);
		},
		push() {

		},
		destroy() {
			viewport.destroy();
		}
	};
}
