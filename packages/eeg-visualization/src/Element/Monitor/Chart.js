import { Box } from 'pixijs-box';
import { Graphics } from 'pixi.js';
// import { getFullTimeString } from './utils';

export class Chart extends Box {
	get layout() {
		return this.parent.layout;
	}

	created() {
		const box = this;
		const { container, context } = box;
		const { CHART_PADDING_BOTTOM } = context.state.SIZE;
		const oBorder = new Graphics();

		container.addChild(oBorder);
		// const state = {
		// 	scannerTimer: null
		// };

		function drawBorder() {
			oBorder
				.clear().lineStyle(1, 0x999999, 1)
				.drawRect(0, 0, box.width, box.height - CHART_PADDING_BOTTOM);
		}

		// .on('sampling-on', () => {
		// 	oScanner.visible = true;
		// 	state.scannerTimer = context.watch((_c, _s, now) => {
		// 		const { sampling, chart } = context.state;

		// 		oCurrent.text = `${getFullTimeString(new Date())}`;
		// 		oScanner.x = (now - chart.timeline.start) / sampling.span * this.width;
		// 	});
		// })
		// .on('sampling-off', () => oScanner.visible = false)
		context
			.on('channel-layout-change', () => {
				const { SIZE } = context.state;
				const { labelWidth, valueWidth } = box.layout;

				box.setStyle({
					left: labelWidth + SIZE.GUTTER,
					right: valueWidth + SIZE.SCROLLER_WIDTH + SIZE.GUTTER * 2
				});

				drawBorder();
			});
	}
}