import { Graphics, Ticker, Text } from 'pixi.js';
import { getFullTimeString } from './utils';

// const CHANNEL_LABEL_WIDTH = 90;
// const CHANNEL_VALUE_WIDTH = 60;
// const NAVIGATOR_HEIGHT = 20;

export default function Coordinate(viewport) {
	const box = viewport.createBox('Coordinate');
	const { container, context } = box;
	const oScanner = new Graphics();
	const oCurrent = new Text('', { fontSize: 12 });
	const oBorder = new Graphics();

	oScanner.addChild(oCurrent);
	container.addChild(oBorder, oScanner);

	const state = {
		height: 0,
		width: 0,
		start: Date.now(),
		end: Date.now(),
		duration: context.duration,
		sampling: context.sampling
	};

	function setTimeline(now = 0) {
		state.start = Math.floor(now / 1000) * 1000;
		state.end = state.start + state.duration;
	}

	function drawBorder() {
		oBorder
			.clear().lineStyle(1, 0x999999, 1, 0)
			.drawRect(0, 0, state.width, state.height - 30);
	}

	function drawScanner() {
		oScanner
			.clear().lineStyle(1, 0x000000, 1, 0)
			.moveTo(0, 0).lineTo(0, state.height - 20)
			.x = 0;

		oCurrent.y = state.height - 20;
		oCurrent.x = -oCurrent.width / 2;
	}

	Ticker.shared.add(() => {
		const samplingChanged = context.sampling !== state.sampling;

		if (samplingChanged) {
			state.sampling = context.sampling;

			if (state.sampling === false) {
				oScanner.visible = false;
				setTimeline();
			}
		}

		const now = Date.now();

		if (state.sampling) {
			oCurrent.text = `${getFullTimeString(new Date())}`;

			if (now > state.end) {
				setTimeline(now);
			}

			if (state.duration !== context.duration) {
				state.duration = context.duration;
				setTimeline(now);
			}

			if (state.height !== box.height) {
				state.height = box.height;
				drawScanner();
				drawBorder();
			}

			if (state.width !== box.width) {
				state.width = box.width;
				drawBorder();
			}

			oScanner.visible = true;
			oScanner.x = Math.round((now - state.start) / context.duration * state.width);
		}
	});

	return {
		box: box,
		resize() {
		}
	};
}
