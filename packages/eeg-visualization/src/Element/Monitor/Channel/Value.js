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

		const TextStyle = {
			value: ValueTextStyle()
		};

		function clear() {
			oValueList.forEach(oValue => oValue.destroy());
			oValueList.length = 0;
		}

		function drawValueList() {
			clear();

			const { commonChannelList } = box;
			const { valueWidth, channelHeight, commonHeight, commonY, bottomY } = box.layout;
			const { top: topChannelList, bottom: bottomChannelList } = context.state.channel;
			const dataIndex = context.state.chart.tooltip.position;

			const commonMiddleOffsetY = computeGlobalOffset(commonHeight, channelHeight, commonChannelList.length);
			const commonInitY = commonMiddleOffsetY + commonY;

			function createObjectValue(channel, index, initY = 0) {
				const textStyle = TextStyle.value.clone();
				const oValue = new Text(`${channel.data[dataIndex].toFixed(1)}`, textStyle);

				if (channel.style.color) {
					textStyle.fill = channel.style.color;
				}

				oValueList.push(oValue);
				container.addChild(oValue);
				oValue.x = valueWidth - oValue.width;
				oValue.y = initY + index * (channelHeight + SIZE.GUTTER);
			}

			topChannelList.forEach((channel, index) => createObjectValue(channel, index));
			commonChannelList.forEach((channel, index) => createObjectValue(channel, index, commonInitY));
			bottomChannelList.forEach((channel, index) => createObjectValue(channel, index, bottomY));
		}

		context
			.on('value-select', drawValueList)
			.on('channel-display-change', () => {
				const { valueWidth, channelHeight } = this.layout;

				this.setStyle({ width: valueWidth });
				TextStyle.value.fontSize = channelHeight;
				drawValueList();
			});
	}
}