import { Box } from 'pixijs-box';
import { Text, TextStyle } from 'pixi.js';

const GUTTER = 0;

const FONT_STYLE = new TextStyle({
	fontWeight: 'bold',
	fontSize: 8,
	fontFamily: 'Consolas',
	fill: 0x0000ff
});

const REFERENCE_STYLE = new TextStyle({
	fontSize: 8,
	fontFamily: 'Consolas',
	fill: 0x3366FF
});

function computeGlobalOffset(containerHeight, length) {
	Math.floor((containerHeight - (length * FONT_STYLE.fontSize + (length - 1) * GUTTER)) / 2);
	return 0;
}

export class Label extends Box {
	created() {
		const oLabelList= [];
		const { container, context } = this;

		function render() {
			const { display: channelList, config } = context.state.channel;
			const globalY = computeGlobalOffset(container.height, channelList.length);

			oLabelList.forEach(oLabel => {
				oLabel.destroy();
				container.removeChild(oLabel);
			});

			oLabelList.length = 0;

			channelList.forEach((channel, index) => {
				const oLabel = new Text(channel.name, FONT_STYLE);
				const oReference = new Text(channel.reference.join(','), REFERENCE_STYLE);

				oLabel.addChild(oReference);
				oLabel.y = globalY + index * (config.fontSize + GUTTER);
				oReference.x = Math.floor(config.fontSize * (config.maxNameLength + 1) * 0.6);

				container.addChild(oLabel);
				oLabelList.push(oLabel);
			});
		}

		context
			.on('channel-display-change', () => {
				this.setStyle({ width: context.state.channel.config.labelWidth });
				render();
			});
	}
}

export class Value extends Box {
	created() {
		const oValueList = [];
		const valueList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const { container, context } = this;
		const state = { timer: null };

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
				const oValue = new Text(`${value}`, FONT_STYLE);

				oValueList.push(oValue);
				container.addChild(oValue);
				oValue.x = config.valueWidth - oValue.width;
				oValue.y = globalY + index * (FONT_STYLE.fontSize + GUTTER);
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
				FONT_STYLE.fontSize = fontSize;
				REFERENCE_STYLE.fontSize = fontSize;
				drawValueList();
			});
	}
}

export class Wave extends Box {}