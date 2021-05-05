import { Box } from 'pixijs-box';
import { Graphics, Text } from 'pixi.js';
import { getFullTimeString } from './utils';

export class Chart extends Box {
	created() {
		const oScanner = new Graphics();
		const oCurrent = new Text('00:00:00.000', { fontSize: 12, fontFamily: 'Consolas' });
		const oBorder = new Graphics();

		oScanner.addChild(oCurrent);
		this.container.addChild(oBorder, oScanner);

		const state = {
			start: Date.now(),
			end: Date.now(),
			scannerTimer: null
		};

		const setTimeline = (now = 0) => {
			state.start = Math.floor(now / 1000) * 1000;
			state.end = state.start + this.context.state.interval;
		};

		this.context
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
			.on('interval-change', () => setTimeline(Date.now()))
			.on('sampling-off', () => {
				oScanner.visible = false;
				this.context.clearFrame(state.scannerTimer);
			})
			.on('resize', () => {
				oBorder
					.clear().lineStyle(1, 0x999999, 1, 0)
					.drawRect(0, 0, this.width, this.height);

				oScanner
					.clear().lineStyle(1, 0x000000, 1, 0)
					.moveTo(0, 0).lineTo(0, this.height)
					.x = 0;

				oCurrent.y = this.height + 4;
				oCurrent.x = -oCurrent.width / 2;
			});
	}
}