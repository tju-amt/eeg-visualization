import { Box } from 'pixijs-box';
import { computeLayout } from './utils';

export { Chart } from './Chart';
export { Timeline } from './Timeline';
export { Label, Value, Wave } from './Channel';
export { Scroller } from './Scroller';
export { Scale } from './Scale';

/**
 * When to update monitor layout:
 *   - change all channel
 *   - after resize
 */
export class Monitor extends Box {
	created() {
		const box = this;
		const { context } = box;

		this.layout = {};

		function updateLayout() {
			const { channel, chart, SIZE } = context.state;
			const { options: channelOptions } = channel;
			const layoutHeight = box.height - SIZE.CHART_PADDING_BOTTOM;
			const layout = computeLayout(layoutHeight, chart.scroller.length, channelOptions);

			box.layout = Object.freeze(layout);
			context.emit('channel-layout-change');
		}

		context
			.on('mounted', updateLayout)
			.on('resize', updateLayout)
			.on('channel-change', updateLayout);
	}
}