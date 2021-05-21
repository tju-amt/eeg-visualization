import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';

import {
	ValueTextStyle,
	computeGlobalOffset,
	SIZE
} from './utils';

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
		const valueList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const { container, context } = this;
		const state = { timer: null };

		const TextStyle = {
			value: ValueTextStyle()
		};

		function clear() {
			oValueList.forEach(oValue => oValue.destroy());
			oValueList.length = 0;
		}

		function drawValueList() {
			const { commonChannelList } = box;
			const { valueWidth, channelHeight } = box.layout;
			const globalY = computeGlobalOffset(box.height, commonChannelList.length);

			context.clearInterval(state.timer);
			clear();

			valueList.forEach((value, index) => {
				const oValue = new Text(`${value}`, TextStyle.value);

				oValueList.push(oValue);
				container.addChild(oValue);
				oValue.x = valueWidth - oValue.width;
				oValue.y = globalY + index * (channelHeight + SIZE.GUTTER);
			});

			startUpdating();
		}

		function updateValueList() {
			const { valueWidth } = box.layout;

			oValueList.forEach((oValue, index) => {
				oValue.text = `${valueList[index]}`;
				oValue.x = valueWidth - oValue.width;
			});
		}

		function startUpdating() {
			state.timer = context.setInterval(() => {
				valueList.forEach((_, index) => valueList[index] = Math.random().toFixed(3));
				updateValueList();
			}, 1000);
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