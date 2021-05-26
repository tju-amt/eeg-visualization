import { Box } from 'pixijs-box';
import { TextStyle, Graphics, Text } from 'pixi.js';
import { getTimelinePostion, getFullTimeString } from './utils';

const TAG_STYLE = new TextStyle({
	fontSize: 12,
	fontFamily: 'Consolas',
	fill: 0x666666
});

const PRIMARY_LENGTH = 10;
const SECONDARY_LENGTH = 5;

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

		function setStyleWithGrid() {
			oPrimaryMark.lineStyle(1, 0xAAAAAA);
			oSecondaryMark.lineStyle(1, 0xDDDDDD);
		}

		function setStyleWithoutGrid() {
			oPrimaryMark.lineStyle(2, 0x666666);
			oSecondaryMark.lineStyle(1, 0x999999);
		}

		function drawTimeline() {
			clear();

			const { start, end, grid } = context.state.chart.timeline;
			const span = end - start;
			const { width } = box;
			const marks = getTimelinePostion(width, 80, start, end);
			const lineEnd = box.parent.height - context.state.SIZE.CHART_PADDING_BOTTOM;
			const primaryEnd = grid ? lineEnd : PRIMARY_LENGTH;
			const secondaryEnd = grid ? lineEnd : SECONDARY_LENGTH;

			oPrimaryMark.clear();
			oSecondaryMark.clear();
			oBorder.clear().lineStyle(1, 0x000000, 1, 0);
			(grid ? setStyleWithGrid : setStyleWithoutGrid)();

			marks.secondary
				.map(mark => (mark - start) / span * width)
				.forEach(pos => oSecondaryMark.moveTo(pos, 0).lineTo(pos, -secondaryEnd));

			marks.primary
				.forEach(mark => {
					const pos = (mark - start) / span * width;
					const oTag = new Text(getFullTimeString(new Date(mark)), TAG_STYLE);

					oPrimaryMark.addChild(oTag);
					oPrimaryTagList.push(oTag);
					oPrimaryMark.moveTo(pos, 0).lineTo(pos, -primaryEnd);
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