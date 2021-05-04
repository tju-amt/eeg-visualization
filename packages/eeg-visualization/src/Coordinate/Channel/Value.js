import { Text, Ticker, TextStyle } from 'pixi.js';

const FONT_SIZE = 16;
const GUTTER = 10;

const FONT_STYLE = new TextStyle({
	fontSize: FONT_SIZE,
	fontFamily: 'Courier'
});

export default function Coordinate(viewport) {
	const box = viewport.createBox('ChannelValue');
	const oValueList = [];

	const state = {
		valueList:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		updatedAt: Date.now()
	};

	function drawValueList() {
		oValueList.forEach(oValue => {
			oValue.destroy();
			box.container.removeChild(oValue);
		});

		state.valueList.forEach((value, index) => {
			const oValue = new Text(`${value}`, FONT_STYLE);

			oValueList.push(oValue);
			box.container.addChild(oValue);
			oValue.x = 10;
			oValue.y = index * (FONT_SIZE + GUTTER);
		});
	}

	function updateValueList() {
		state.valueList.forEach((value, index) => oValueList[index].text = `${value}`);
	}

	box.context.setInterval(() => {
		state.valueList.forEach((_, index) => state.valueList[index] = Math.random().toFixed(2));
	}, 1000);

	Ticker.shared.add(() => {
		const now = Date.now();

		if (oValueList.length !== state.valueList.length) {
			drawValueList();
		}

		if (now - state.updatedAt > 1000) {
			state.updatedAt = now;
			updateValueList();
		}
	});

	return {
		box: box
	};
}