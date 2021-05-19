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
	get layoutHeight() {
		return this.height - this.context.state.SIZE.CHART_PADDING_BOTTOM;
	}

	get valueWidth() {
		return this.layout.valueWidth;
	}

	get labelWidth() {
		return this.layout.labelWidth;
	}

	get maxNameLength() {
		return this.layout.maxNameLength;
	}

	get channelHeight() {
		return this.layout.channelHeight;
	}

	get maxCommonChannelNumberInView() {
		return this.layout.maxCommonChannelNumberInView;
	}

	created() {
		const box = this;
		const { context } = box;

		this.layout = {};

		function updateLayout() {
			const { channel, chart } = context.state;
			const { options: channelOptions } = channel;

			box.layout = computeLayout(box.layoutHeight, chart.scroller.length, channelOptions);
			context.emit('channel-layout-change');
		}

		context
			.on('mounted', updateLayout)
			.on('resize', updateLayout)
			.on('channel-change', updateLayout);
	}
}