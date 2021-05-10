import { Viewport, assembly } from 'pixijs-box';

import * as Title from './src/Element/Title';
import * as Monitor from './src/Element/Monitor';
import * as Navigator from './src/Element/Navigator';

const ALL_ELEMENT_CLASS = Object.assign({}, Title, Monitor, Navigator);

import BaseState from './src/State';
import { computeChannelConfig } from './src/utils';

import layout from './src/layout';

export default function EegVisualization() {
	const viewport = new Viewport();
	const { context } = viewport;

	window.c = viewport.context;

	Object.assign(context.state, BaseState(context));

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
		let samplingWatcherId = null;

		context
			.on('resize', updateLabelConfig)
			.on('channel-change', updateLabelConfig)
			.on('sampling-off', () => context.unwatch(samplingWatcherId))
			.on('sampling-on', () => {
				const { state } = context;

				samplingWatcherId = context.watch((_c, scope, now) => {
					const { interval } = state.sampling;

					if (now > scope.end || scope.interval !== interval) {
						state.chart.timeline.start = now;
						state.chart.timeline.end = scope.end = now + interval;
						scope.interval = interval;
					}
				}, { end: 0, interval: null });
			});

		context.emit('channel-change');
	});

	const boxMap = assembly(ALL_ELEMENT_CLASS, layout, viewport);

	const ON_WHEEL = {
		'global'(event) {
			const { scroller } = context.state.chart;

			scroller.start += event.deltaY > 0 ? scroller.step : -scroller.step;
		},
		'scale-volt'(event) {
			const { scale } = context.state.chart;

			scale.setMicrovolt(event.deltaY < 0);
		},
		'scale-ruler'(event) {
			const { scale } = context.state.chart;

			scale.pixel = Math.round(scale.pixel / 10) * 10 + (event.deltaY > 0 ? -10 : 10);
		}
	};

	return {
		install(element) {
			viewport.mount(element);

			viewport.app.view.addEventListener('wheel', (event) => {
				event.stopPropagation();
				event.preventDefault();
				ON_WHEEL[context.state.hover](event);
			});
		},
		push() {

		},
		destroy() {
			viewport.destroy();
		}
	};
}
