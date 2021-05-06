import { Viewport, assembly } from 'pixijs-box';

import { Title, TitleDate, TitleDevice } from './src/Element/Title';
import { Monitor, Label, Value, Chart, Scroller, Scale } from './src/Element/Monitor';
import { Navigator } from './src/Element/Navigator';

import layout from './src/layout';

export default function EegVisualization() {
	const viewport = new Viewport();

	const { context } = viewport;
	const { state } = context;

	window.c = viewport.context;

	state.sampling = true;
	state.interval = 2000;
	state.channel = [
		'FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ'
	].map(channel => {
		return {
			name: channel,
			reference: ['M1', 'M2']
		};
	});

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

	assembly({
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
