import { Box } from 'pixijs-box';
import { TextStyle, Graphics, Text } from 'pixi.js';
import { getTimelinePostion, getFullTimeString } from './utils';

const TAG_STYLE = new TextStyle({
	fontSize: 12,
	fontFamily: 'Consolas',
	fill: 0x666666
});

export class Timeline extends Box {
	created() {
		const box = this;
		const { container, context } = this;
		const oPrimaryMark = new Graphics();
		const oSecondaryMark = new Graphics();
		const oBorder = new Graphics();
		const oPrimaryTagList = [];

		container.addChild(oSecondaryMark, oPrimaryMark, oBorder);

		function clear() {
			oPrimaryTagList.forEach(oTag => oTag.destroy());
			oPrimaryTagList.length = 0;
		}

		function drawTimeline() {
			const { start, end } = context.state.chart.timeline;
			const span = end - start;
			const { width } = box;
			const marks = getTimelinePostion(width, 80, start, end);

			oPrimaryMark.clear().lineStyle(2, 0x666666, 1, 0);
			oSecondaryMark.clear().lineStyle(1, 0x999999, 1, 0);
			oBorder.clear().lineStyle(1, 0x000000, 1, 0);
			clear();

			marks.secondary
				.map(mark => (mark - start) / span * width)
				.forEach(pos => oSecondaryMark.moveTo(pos, 0).lineTo(pos, -5));

			marks.primary
				.forEach(mark => {
					const pos = (mark - start) / span * width;
					const oTag = new Text(getFullTimeString(new Date(mark)), TAG_STYLE);

					oPrimaryMark.addChild(oTag);
					oPrimaryTagList.push(oTag);
					oPrimaryMark.moveTo(pos, 0).lineTo(pos, -10);
					oTag.x = Math.trunc(pos - oTag.width / 2);
					oTag.y = 4;
				});

			oBorder.moveTo(0, -1).lineTo(width, -1);
		}

		context
			.on('timeline-change', drawTimeline)
			.on('channel-layout-change', drawTimeline);
	}
}