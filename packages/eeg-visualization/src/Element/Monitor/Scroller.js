import { Box } from 'pixijs-box';
import { Graphics, Rectangle } from 'pixi.js';

const PADDING = 2;

function getRatio(length, total) {
	if (length === 0) {
		return 0;
	} else if (total === 0) {
		return 1;
	}

	if (length > total) {
		console.warn('Invalid scroller state');
	}

	return length / total;
}

export class Scroller extends Box {
	created() {
		const box = this;
		const { container, context } = this;

		const oTrack = new Graphics();
		const oThumb = new Graphics();
		const hTrack = new Rectangle(0, 0);
		const hThumb = new Rectangle(0, 0);

		container.addChild(oTrack);
		oTrack.addChild(oThumb);
		oTrack.interactive = true;
		oThumb.interactive = true;
		oTrack.hitArea = hTrack;
		oThumb.hitArea = hThumb;

		oTrack.on('click', event => {
			const bounds = oThumb.getBounds();
			const { global } = event.data;
			const step = context.state.chart.scroller.length;

			context.state.chart.scroller.start += global.y < bounds.y ? -step : step;
		});

		oThumb.on('click', (event) => {
			event.stopPropagation();
			console.log('thumb', event);
		});

		function drawScrollbar() {
			const { width, height } = box;
			const { channel, chart } = context.state;
			const { scroller } = chart;

			oTrack.clear().beginFill(0xE6E6E6).lineStyle(0).drawRect(0, 0, width, height);
			hTrack.height = height;
			hTrack.width = width;

			const maxThumbHeight = height - 2 * PADDING;
			const thumbX = PADDING;
			const thumbY = PADDING + Math.round(getRatio(scroller.start, channel.list.length) * maxThumbHeight);
			const thumbWidth = width - 2 * PADDING;
			const thumbHeight = Math.min(
				Math.round(getRatio(scroller.length, channel.list.length) * maxThumbHeight),
				maxThumbHeight
			);

			oThumb.clear().beginFill(0xBBBBBB).lineStyle(0).drawRect(0, 0, thumbWidth, thumbHeight);
			oThumb.x = thumbX;
			oThumb.y = thumbY;
			hThumb.width = thumbWidth;
			hThumb.height = thumbHeight;
		}

		context
			.on('channel-config-change', drawScrollbar)
			.on('scroller-change', drawScrollbar);
	}
}