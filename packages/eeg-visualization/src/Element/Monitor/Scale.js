import { Graphics, Rectangle, Text, TextStyle, filters } from 'pixi.js';
import { Box } from 'pixijs-box';

const RULER_WIDTH = 5;
const MARGIN = 10;
const PADDING = 10;

const VOLT_UNIT_LIST = ['μV', 'mV', 'V'];

function voltString(microvolt) {
	let level = 0;

	while (microvolt > 1000) {
		microvolt /= 1000;
		level++;
	}

	return `±${microvolt.toFixed(1)}${VOLT_UNIT_LIST[level]}`;
}

const BASE_STYLE = new TextStyle({
	fontSize: 12,
	fontWeight: '600',
	fontFamily: 'Consolas',
	dropShadow: false,
	dropShadowAlpha: 1,
	dropShadowAngle: 0,
	dropShadowBlur: 5,
	dropShadowColor: '0x000000',
	strokeThickness: 4,
	stroke: 0xffffff,
	dropShadowDistance: 0
});

export class Scale extends Box {
	created() {
		const box = this;
		const { container, context } = this;
		const hRuler = new Rectangle();
		const oRulerShadow = new Graphics();
		const oRuler = new Graphics();

		oRulerShadow.visible = false;
		oRulerShadow.filters = [new filters.BlurFilter(4)];

		const sVolt = BASE_STYLE.clone();
		const sPixel = BASE_STYLE.clone();

		const oVolt = new Text('', sVolt);
		const oPixel = new Text('', sPixel);

		container.addChild(oVolt, oRuler, oPixel);
		oRuler.addChild(oRulerShadow);
		oRuler.interactive = true;
		oVolt.interactive = true;
		oRuler.hitArea = hRuler;

		function drawRuler() {
			const { width, height } = box;
			const { pixel: pixelHeight } = context.state.chart.scale;
			const x = width - RULER_WIDTH - PADDING;
			const startY = height - PADDING - pixelHeight;
			const endY = height - PADDING;

			oRuler
				.clear()
				.lineStyle(5, 0xFFFFFF, 1)
				.moveTo(x - 2, startY)
				.lineTo(width - PADDING, startY)
				.lineTo(width - PADDING, endY)
				.lineTo(x - 2, endY)
				.lineStyle(1, 0x000000, 1)
				.moveTo(x, startY)
				.lineTo(width - PADDING, startY)
				.lineTo(width - PADDING, endY)
				.lineTo(x, endY);

			oRulerShadow
				.clear()
				.lineStyle(1, 0x000000, 1)
				.moveTo(x, startY)
				.lineTo(width - PADDING, startY)
				.lineTo(width - PADDING, endY)
				.lineTo(x, endY);

			oPixel.text = `${context.state.chart.scale.pixel}px`;
			oPixel.x = -(oPixel.width - (width - MARGIN - RULER_WIDTH - PADDING));
			oPixel.y = Math.trunc(startY - oPixel.height / 2);

			hRuler.x = x;
			hRuler.y = startY;
			hRuler.height = pixelHeight;
			hRuler.width = RULER_WIDTH;
		}

		function drawVolt() {
			const { width, height } = box;

			oVolt.text = voltString(context.state.chart.scale.microvolt);
			oVolt.y = Math.trunc(height - oVolt.height / 2 - PADDING);
			oVolt.x = -(oVolt.width - (width - MARGIN - RULER_WIDTH - PADDING));
		}

		oRuler
			.on('mouseover', () => {
				context.state.hover = 'scale-ruler';
				oRulerShadow.visible = true;
				oRuler.cursor = 'pointer';
			})
			.on('mouseout', () => {
				context.state.hover = 'global';
				oRulerShadow.visible = false;
				oRuler.cursor = 'default';
			});

		oVolt
			.on('mouseover', () => {
				context.state.hover = 'scale-volt';
				sVolt.dropShadow = true;
				oVolt.cursor = 'pointer';
			})
			.on('mouseout', () => {
				context.state.hover = 'global';
				sVolt.dropShadow = false;
				oVolt.cursor = 'default';
			});

		context.on('resize', () => {
			drawRuler();
			drawVolt();
		}).on('scale-pixel-change', () => {
			drawRuler();
		}).on('scale-microvolt-change', () => {
			drawVolt();
		});
	}
}