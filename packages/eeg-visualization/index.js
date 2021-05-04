import { Viewport } from 'pixijs-box';
// import { Graphics } from 'pixi.js';
import Coordinate from './src/Coordinate';
import Navigator from './src/Navigator';
import Title from './src/Title';
import ChannelLabel from './src/Coordinate/Channel/Lable';
import ChannelValue from './src/Coordinate/Channel/Value';

const TITLE_HEIGHT = 30;
const CHANNEL_LABEL_WIDTH = 120;
const CHANNEL_VALUE_WIDTH = 60;
const NAVIGATOR_HEIGHT = 60;
const GUTTER = 5;

export default function EegVisualization() {
	const viewport = new Viewport();
	const { context } = viewport;

	window.c = viewport.context;
	window.a = viewport;
	context.sampling = true;
	context.duration = 2000;
	context.channel = {
		list: ['FP1', 'FPZ', 'FP2', 'AF3', 'AF4', 'F7', 'F5', 'F3', 'F1', 'FZ'],
		reference: ['M1', 'M2']
	};

	const coordinate = Coordinate(viewport);
	const navigator = Navigator(viewport);
	const channelLabel = ChannelLabel(viewport);
	const channelValue = ChannelValue(viewport);
	const title = Title(viewport);

	coordinate.box.setStyle({
		top: TITLE_HEIGHT + 2 * GUTTER,
		left: CHANNEL_LABEL_WIDTH + 2 * GUTTER,
		right: CHANNEL_VALUE_WIDTH + 2 * GUTTER,
		bottom: NAVIGATOR_HEIGHT + 2 * GUTTER
	});

	navigator.box.setStyle({
		top: null,
		left: CHANNEL_LABEL_WIDTH + 2 * GUTTER,
		right: CHANNEL_VALUE_WIDTH + 2 * GUTTER,
		bottom: GUTTER,
		height: NAVIGATOR_HEIGHT
	});

	channelLabel.box.setStyle({
		top: TITLE_HEIGHT + 2 * GUTTER,
		width: CHANNEL_LABEL_WIDTH,
		left: GUTTER,
		bottom: NAVIGATOR_HEIGHT + 2 * GUTTER
	});

	channelValue.box.setStyle({
		top: TITLE_HEIGHT + 2 * GUTTER,
		width: CHANNEL_VALUE_WIDTH,
		right: GUTTER,
		bottom: NAVIGATOR_HEIGHT + 2 * GUTTER,
		left: null
	});

	title.box.setStyle({
		top: GUTTER,
		left: GUTTER,
		right: GUTTER,
		height: TITLE_HEIGHT
	});

	viewport.appendBox(coordinate.box);
	viewport.appendBox(navigator.box);
	viewport.appendBox(channelLabel.box);
	viewport.appendBox(channelValue.box);
	viewport.appendBox(title.box);

	const elementList = [];

	return {
		install(element) {
			viewport.mount(element);
		},
		resize() {
			viewport.resize();
			elementList.forEach(element => element.resize());
		},
		push() {

		},
		destroy() {
			viewport.destroy();
		}
	};
}
