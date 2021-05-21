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
	get layout() {
		return this.parent.layout;
	}

	get commonChannelNumberInView() {
		return Math.min(
			this.parent.layout.maxCommonLength,
			this.context.state.chart.scroller.length
		);
	}

	created() {
		const box = this;
		const { container, context } = this;

		const oTrack = new Graphics();
		const oThumb = new Graphics();
		const hTrack = new Rectangle(0, 0);
		const hThumb = new Rectangle(0, 0);
		let commonChannelNumberInView = 0;

		container.addChild(oTrack);
		oTrack.addChild(oThumb);
		oTrack.interactive = true;
		oThumb.interactive = true;
		oTrack.hitArea = hTrack;
		oThumb.hitArea = hThumb;

		oTrack.on('click', event => {
			const bounds = oThumb.getBounds();
			const { global } = event.data;
			const step = commonChannelNumberInView;

			context.state.chart.scroller.start += global.y < bounds.y ? -step : step;
		});

		const local = window.l = {
			isDragging: false,
			startY: 0,
			topY: 0,
			minY: PADDING,
			maxY: 0,
			y: 0,
			dragging(event) {
				const { chart, channel } = context.state;
				const newY = event.offsetY - local.startY + local.topY;
				const fixedY = Math.max(Math.min(newY, local.maxY), local.minY);
				const length = channel.common.length - commonChannelNumberInView;
				const start = Math.round(fixedY / local.maxY * length);

				oThumb.y = fixedY;
				chart.scroller.start = start;
			},
			endDragging() {
				window.removeEventListener('mousemove', local.dragging);
				local.isDragging = false;
				drawScrollbar();
			}
		};

		window.addEventListener('mouseup', local.endDragging);

		oThumb
			.on('mouseover', () => !local.isDragging && drawScrollbar(0x999999))
			.on('mouseout', () => !local.isDragging && drawScrollbar())
			.on('click', (event) => event.stopPropagation())
			.on('mousedown', event => {
				drawScrollbar(0x666666);
				local.isDragging = true;
				local.startY = event.data.global.y;
				local.topY = oThumb.y;
				window.addEventListener('mousemove', local.dragging);
			});

		function drawScrollbar(color = 0xBBBBBB) {
			const { width, height } = box;
			const { channel, chart } = context.state;
			const { scroller } = chart;

			oTrack.clear().beginFill(0xE6E6E6).lineStyle(0).drawRect(0, 0, width, height);
			hTrack.height = height;
			hTrack.width = width;

			const maxThumbHeight = height - 2 * PADDING;
			const thumbX = PADDING;
			const thumbY = PADDING + Math.round(getRatio(scroller.start, channel.common.length) * maxThumbHeight);
			const thumbWidth = width - 2 * PADDING;
			const thumbHeight = Math.min(
				Math.round(getRatio(commonChannelNumberInView, channel.common.length) * maxThumbHeight),
				maxThumbHeight
			);

			local.maxY = maxThumbHeight - thumbHeight;
			oThumb.clear().beginFill(color).lineStyle(0).drawRect(0, 0, thumbWidth, thumbHeight);
			oThumb.x = thumbX;
			oThumb.y = thumbY;
			hThumb.width = thumbWidth;
			hThumb.height = thumbHeight;
		}

		context
			.on('channel-layout-change', () => {
				commonChannelNumberInView = box.commonChannelNumberInView;
				drawScrollbar();
			})
			.on('scroller-change', () => {
				if (!local.isDragging) {
					drawScrollbar();
				}
			});
	}
}