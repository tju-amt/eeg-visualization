import { Box } from 'pixijs-box';
import { Text, TextStyle } from 'pixi.js';

const FONT_SIZE = 8;
const GUTTER = 0;

const FONT_STYLE = new TextStyle({
	fontWeight: 'bold',
	fontSize: FONT_SIZE,
	fontFamily: 'Consolas',
	fill: 0x0000ff
});

function computeGlobalOffset(containerHeight, length) {
	Math.floor((containerHeight - (length * FONT_SIZE + (length - 1) * GUTTER)) / 2);
	return 0;
}

export class Label extends Box {
	created() {
		const oLabelList= [];
		const { container, context } = this;

		context.on('resize', () => {
			const { channel: channelList } = context.state;
			const globalY = computeGlobalOffset(container.height, channelList.length);

			oLabelList.forEach(oLabel => {
				oLabel.destroy();
				container.removeChild(oLabel);
			});

			oLabelList.length = 0;

			channelList.forEach((channel, index) => {
				const oLabel = new Text(channel.name, FONT_STYLE);
				const oReference = new Text(channel.reference.join(','), FONT_STYLE);

				oLabel.addChild(oReference);
				oLabel.x = 10;
				oLabel.y = globalY + index * (FONT_SIZE + GUTTER);
				oReference.x = 40;

				container.addChild(oLabel);
				oLabelList.push(oLabel);
			});
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
			const { channel: channelList } = context.state;
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
				oValue.x = 10;
				oValue.y = globalY + index * (FONT_SIZE + GUTTER);
			});

			startUpdating();
		}

		function updateValueList() {
			valueList.forEach((value, index) => oValueList[index].text = `${value}`);
		}

		function startUpdating() {
			state.timer = context.setInterval(() => {
				valueList.forEach((_, index) => valueList[index] = Math.random().toFixed(2));
				updateValueList();
			}, 1000);
		}

		context.on('resize', drawValueList);
	}
}

export class Wave extends Box {}