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

	context.on('mounted', function install() {
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

		context.on('resize', updateLabelConfig);
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
