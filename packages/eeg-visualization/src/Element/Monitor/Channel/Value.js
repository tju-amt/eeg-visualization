import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';

import {
	ValueTextStyle,
	computeGlobalOffset,
	SIZE
} from './utils';

export class Value extends Box {
	created() {
		const oValueList = [];
		const valueList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const { container, context } = this;
		const state = { timer: null };

		const TextStyle = {
			value: ValueTextStyle()
		};

		function drawValueList() {
			const { list: channelList, config } = context.state.channel;
			const globalY = computeGlobalOffset(container.height, channelList.length);

			context.clearInterval(state.timer);

			oValueList.forEach(oValue => {
				oValue.destroy();
				container.removeChild(oValue);
			});

			oValueList.length = 0;

			valueList.forEach((value, index) => {
				const oValue = new Text(`${value}`, TextStyle.value);

				oValueList.push(oValue);
				container.addChild(oValue);
				oValue.x = config.valueWidth - oValue.width;
				oValue.y = globalY + index * (config.fontSize + SIZE.GUTTER);
			});

			startUpdating();
		}

		function updateValueList() {
			const { valueWidth } = context.state.channel.config;

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
			.on('channel-config-change', () => {
				const { valueWidth, fontSize } = context.state.channel.config;

				this.setStyle({ width: valueWidth });
				TextStyle.value.fontSize = fontSize;
				drawValueList();
			});
	}
}