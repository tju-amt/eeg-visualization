import { Box } from 'pixijs-box';
import { Graphics, Text, TextStyle } from 'pixi.js';
import { getFullTimeString } from './utils';

const INIT_TIME = '00:00:00.000';

const ENDPOINT_TEXT_STYLE = new TextStyle({
	fontSize: 14,
	fontFamily: 'Consolas',
	fontWeight: 'bold',
	fill: 0x999999
});
export class Chart extends Box {
	created() {
		const oScanner = new Graphics();
		const oCurrent = new Text(INIT_TIME, { fontSize: 12, fontFamily: 'Consolas' });
		const oBorder = new Graphics();
		const oStart = new Text(INIT_TIME, ENDPOINT_TEXT_STYLE);
		const oEnd = new Text(INIT_TIME, ENDPOINT_TEXT_STYLE);

		oScanner.addChild(oCurrent);
		oBorder.addChild(oStart, oEnd);
		this.container.addChild(oBorder, oScanner);

		const state = {
			start: Date.now(),
			end: Date.now(),
			scannerTimer: null
		};

		const setTimeline = (now = 0) => {
			state.start = Math.floor(now / 1000) * 1000;
			state.end = state.start + this.context.state.interval;
			oStart.text = getFullTimeString(new Date(state.start));
			oEnd.text = getFullTimeString(new Date(state.end));
		};

		const drawBorder = () => {
			const { width, height } = this;

			oBorder
				.clear().lineStyle(1, 0x999999, 1, 0)
				.drawRect(0, 0, width, height);

			oStart.x = Math.floor(-oStart.width / 2);
			oStart.y = height + 4;

			oEnd.x = Math.floor(-oStart.width / 2) + width;
			oEnd.y = height + 4;
		};

		this.context
			.on('interval-change', () => setTimeline(Date.now()))
			.on('sampling-on', () => {
				oScanner.visible = true;
				state.scannerTimer = this.context.setFrame(() => {
					const now = Date.now();
					const { interval } = this.context.state;

					if (now > state.end) {
						setTimeline(now);
					}

					oCurrent.text = `${getFullTimeString(new Date())}`;
					oScanner.x = Math.round((now - state.start) / interval * this.width);
				});
			})
			.on('sampling-off', () => {
				oScanner.visible = false;
				this.context.clearFrame(state.scannerTimer);
			})
			.on('resize', () => {
				drawBorder();
				oScanner
					.clear().lineStyle(1, 0x000000, 1, 0)
					.moveTo(0, 0).lineTo(0, this.height)
					.x = 0;

				oCurrent.y = this.height + 4;
				oCurrent.x = -oCurrent.width / 2;
			});
	}
}