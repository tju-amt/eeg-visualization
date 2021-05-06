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

	context
		.watch('sampling-on', (context, scope) => {
			const { sampling } = context.state;

			if (sampling !== scope.sampling) {
				scope.sampling = sampling;

				return sampling;
			}

			return false;
		}, { sampling: null })
		.watch('sampling-off', (context, scope) => {
			const { sampling } = context.state;

			if (sampling !== scope.sampling) {
				scope.sampling = sampling;

				return !sampling;
			}

			return false;
		}, { sampling: null }).watch('interval-change', (context, scope) => {
			const { interval } = context.state;

			if (interval !== scope.interval) {
				scope.interval = interval;

				return true;
			}

			return false;
		}, { interval: null })
		.watch('channel-change', (context, scope) => {
			const { channel } = context.state;

			if (channel !== scope.channel) {
				scope.channel = channel;

				return true;
			}

			return false;
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
