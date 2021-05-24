import { Viewport, assembly } from 'pixijs-box';

import * as Title from './src/Element/Title';
import * as Monitor from './src/Element/Monitor';
import * as Navigator from './src/Element/Navigator';

const ALL_ELEMENT_CLASS = Object.assign({}, Title, Monitor, Navigator);

import BaseState from './src/State';
import layout from './src/layout';

export default function EegVisualization() {
	const viewport = new Viewport();
	const { context } = viewport;

	window.c = viewport.context;

	Object.assign(context.state, BaseState(context));
	assembly(ALL_ELEMENT_CLASS, layout, viewport);

	context
		.on('scroller-change', () => context.emit('channel-layout-change'))
		.on('channel-layout-change', () => context.emit('channel-display-change'));

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

	return Object.freeze({
		install(element) {
			viewport.mount(element);

			viewport.app.view.addEventListener('wheel', (event) => {
				event.stopPropagation();
				event.preventDefault();
				ON_WHEEL[context.state.hover](event);
			});
		},
		destroy() {
			viewport.destroy();
		},
		setup(options) {
			context.state.channel.setup(options);
		},
		push() {

		},
		set sampleList(value) {
			console.log(value);
		},
		setState() {

		},
		getState() {

		}
	});
}
