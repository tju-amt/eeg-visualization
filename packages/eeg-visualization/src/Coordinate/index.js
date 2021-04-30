import { Graphics, Ticker } from 'pixi.js';

// const CHANNEL_LABEL_WIDTH = 90;
// const CHANNEL_VALUE_WIDTH = 60;
// const NAVIGATOR_HEIGHT = 20;


export default function Coordinate(viewport) {
	const box = viewport.createBox('Coordinate');
	const { container } = box;
	const oScanner = new Graphics();

	container.addChild(oScanner);

	oScanner
		.lineStyle(2, 0x000000, 1, 0)
		.moveTo(0, 0).lineTo(0, 400);

	Ticker.shared.add(function moveScanner() {
		oScanner.x = (oScanner.x + 1) % 500;
	});

	return {
		box: box,
		resize() {

		}
	};
}
