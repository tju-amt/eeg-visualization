import { Viewport, assembly } from 'pixijs-box';

import { Title, TitleDate, TitleDevice } from './src/Element/Title';
import { Monitor, Label, Value, Chart, Scroller, Scale } from './src/Element/Monitor';
import { Navigator } from './src/Element/Navigator';

import baseState from './src/State';
import { computeChannelConfig } from './src/utils';

import layout from './src/layout';

export default function EegVisualization() {
	const viewport = new Viewport();
	const { context } = viewport;

	window.c = viewport.context;

	Object.assign(context.state, baseState);

	context.watch((context, scope) => {
		if (context.state.sampling !== scope.sampling) {
			scope.sampling = context.state.sampling;
			context.emit(scope.sampling ? 'sampling-on' : 'sampling-off');
		}
	}, { sampling: null });

	context.watch((context, scope) => {
		if (context.state.interval !== scope.interval) {
			scope.interval = context.state.interval;
			context.emit('interval-change');
		}
	}, { interval: null });

	context.watch((context, scope) => {
		if (context.state.channel !== scope.channel) {
			scope.channel = context.state.channel;
			context.emit('channel-change');
		}
	}, { channel: [] });

	function updateLabelConfig() {
		const { channel } = context.state;

		channel.config = computeChannelConfig(
			boxMap.label.height,
			channel.list,
			channel.top,
			channel.bottom
		);
	}

	context
		.on('channel-change', updateLabelConfig)
		.on('resize', updateLabelConfig);

	const boxMap = assembly({
		Title, TitleDevice, TitleDate,
		Monitor, Label, Value, Chart, Scroller, Scale,
		Navigator
	}, layout, viewport);

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
