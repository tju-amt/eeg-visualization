import { Text, Ticker, TextStyle } from 'pixi.js';

const FONT_SIZE = 16;
const GUTTER = 10;

const FONT_STYLE = new TextStyle({
	fontWeight: 'bold',
	fontSize: FONT_SIZE,
	fontFamily: 'Consolas',
	fill: 0x0000ff
});

export default function Coordinate(viewport) {
	const box = viewport.createBox('ChannelLabel');
	const { context, container } = box;

	const oLabelList= [];
	const state = {
		channel: null
	};

	function drawLabelList() {
		const { reference } = state.channel;

		oLabelList.forEach(oLabel => {
			oLabel.destroy();
			container.removeChild(oLabel);
		});

		state.channel.list.forEach((channelName, index) => {
			const oLabel = new Text(channelName, FONT_STYLE);
			const oReference = new Text(reference.join(','), FONT_STYLE);

			oLabel.addChild(oReference);
			oLabel.x = 10;
			oLabel.y = index * (FONT_SIZE + GUTTER);
			oReference.x = 40;

			container.addChild(oLabel);
		});
	}

	Ticker.shared.add(() => {
		if (state.channel !== context.channel) {
			state.channel = context.channel;
			drawLabelList();
		}
	});


	return {
		box: box
	};
}