import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';
import { ValueTextStyle, computeGlobalOffset, SIZE } from './utils';

export class Value extends Box {
	get commonChannelList() {
		const length = this.layout.commonLength;
		const start = this.context.state.chart.scroller.start;

		return this.context.state.channel.common.slice(start, start + length);
	}

	get layout() {
		return this.parent.layout;
	}

	created() {
		const box = this;
		const oValueList = [];
		const { container, context } = this;
		const state = { timer: null };

		const TextStyle = {
			value: ValueTextStyle()
		};

		function clear() {
			oValueList.forEach(oValue => oValue.destroy());
			oValueList.length = 0;
			context.clearInterval(state.timer);
		}

		function drawValueList() {
			clear();

			const { commonChannelList } = box;
			const { valueWidth, channelHeight, commonHeight, commonY, bottomY } = box.layout;
			const { top: topChannelList, bottom: bottomChannelList } = context.state.channel;

			const commonMiddleOffsetY = computeGlobalOffset(commonHeight, channelHeight, commonChannelList.length);
			const commonInitY = commonMiddleOffsetY + commonY;

			function createIbjectValue(channel, index, initY = 0) {
				const oValue = new Text(`${channel.last}`, TextStyle.value);

				oValueList.push(oValue);
				container.addChild(oValue);
				oValue.x = valueWidth - oValue.width;
				oValue.y = initY + index * (channelHeight + SIZE.GUTTER);
			}

			topChannelList.forEach((channel, index) => createIbjectValue(channel, index));
			commonChannelList.forEach((channel, index) => createIbjectValue(channel, index, commonInitY));
			bottomChannelList.forEach((channel, index) => createIbjectValue(channel, index, bottomY));
		}

		context
			.on('channel-display-change', () => {
				const { valueWidth, channelHeight } = this.layout;

				this.setStyle({ width: valueWidth });
				TextStyle.value.fontSize = channelHeight;
				drawValueList();
			});
	}
}