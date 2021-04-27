// import * as PIXI from 'pixi.js';
// import { PBox } from 'pixijs-box';

// const CHANNEL_LABEL_WIDTH = 90;
// const CHANNEL_VALUE_WIDTH = 60;
// const NAVIGATOR_HEIGHT = 20;

export default function Coordinate(viewport) {
	const box = viewport.createBox();

	return {
		box: box
	};
}
