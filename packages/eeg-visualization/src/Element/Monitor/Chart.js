import { Box } from 'pixijs-box';
import { Graphics, Text } from 'pixi.js';
import { getFullTimeString } from './utils';

const INIT_TIME = '00:00:00.000';
export class Chart extends Box {
	created() {
		const { CHART_PADDING_BOTTOM } = this.context.state.SIZE;
		const oScanner = new Graphics();
		const oCurrent = new Text(INIT_TIME, { fontSize: 12, fontFamily: 'Consolas' });
		const oBorder = new Graphics();

		oScanner.addChild(oCurrent);
		this.container.addChild(oBorder, oScanner);

		const state = {
			scannerTimer: null
		};

		const drawBorder = () => {
			const { width, height } = this;

			oBorder
				.clear().lineStyle(1, 0x999999, 1, 0)
				.drawRect(0, 0, width, height  - CHART_PADDING_BOTTOM);
		};

		const drawScanner = () => {
			oScanner
				.clear().lineStyle(1, 0x000000, 1, 0)
				.moveTo(0, 0).lineTo(0, this.height - CHART_PADDING_BOTTOM)
				.x = 0;

			oCurrent.y = this.height + 4 - CHART_PADDING_BOTTOM;
			oCurrent.x = -oCurrent.width / 2;
		};

		this.context
			.on('sampling-on', () => {
				oScanner.visible = true;
				state.scannerTimer = this.context.watch((_c, _s, now) => {
					const { sampling, chart } = this.context.state;

					oCurrent.text = `${getFullTimeString(new Date())}`;
					oScanner.x = (now - chart.timeline.start) / sampling.interval * this.width;
				});
			})
			.on('sampling-off', () => oScanner.visible = false)
			.on('channel-config-change', () => {
				const { SIZE } = this.context.state;
				const { labelWidth, valueWidth } = this.context.state.channel.config;

				this.setStyle({
					left: labelWidth + SIZE.GUTTER,
					right: valueWidth + SIZE.SCROLLER_WIDTH + SIZE.GUTTER * 2
				});

				drawBorder();
				drawScanner();
			});
	}
}