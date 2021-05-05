import { Viewport, assembly } from 'pixijs-box';

import { Title, TitleDate, TitleDevice } from './src/Element/Title';
import { Monitor, ChannelLabel, LastValue, Chart, Scroller, Legend } from './src/Element/Monitor';
import { Navigator } from './src/Element/Navigator';

import layout from './src/layout';

export default function EegVisualization() {
	const viewport = new Viewport();

	const { context } = viewport;

	window.c = viewport.context;
	window.a = viewport;

	context.state.sampling = true;
	context.state.interval = 2000;
	context.state.channel = {
		list: ['FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ'],
		reference: ['M1', 'M2']
	};

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
		}, { interval: null });

	assembly({
		Title, TitleDevice, TitleDate,
		Monitor, ChannelLabel, LastValue, Chart, Scroller, Legend,
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
