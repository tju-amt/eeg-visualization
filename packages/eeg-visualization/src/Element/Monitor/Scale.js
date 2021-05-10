import { Graphics, Rectangle, Text, TextStyle, filters } from 'pixi.js';
import { Box } from 'pixijs-box';

const RULER_WIDTH = 5;
const MARGIN = 10;
const PADDING = 5;

const VOLT_UNIT_LIST = ['μV', 'mV', 'V'];

function voltString(microvolt) {
	let level = 0;

	while (microvolt > 1000) {
		microvolt /= 1000;
		level++;
	}

	return `${microvolt.toFixed(1)} ${VOLT_UNIT_LIST[level]}`;
}

export class Scale extends Box {
	created() {
		const box = this;
		const { container, context } = this;
		const hRuler = new Rectangle();
		const oRulerShadow = new Graphics();
		const oRuler = new Graphics();

		oRulerShadow.visible = false;
		oRulerShadow.filters = [new filters.BlurFilter(2)];

		const sVolt = new TextStyle({
			fontSize: 12,
			fontFamily: 'Consolas',
			dropShadow: false,
			dropShadowAlpha: 1,
			dropShadowAngle: 0,
			dropShadowBlur: 3,
			dropShadowColor: '0x000000',
			dropShadowDistance: 0
		});

		const oVolt = new Text('', sVolt);

		container.addChild(oVolt, oRuler);
		oRuler.addChild(oRulerShadow);
		oRuler.interactive = true;
		oVolt.interactive = true;
		oRuler.hitArea = hRuler;

		function drawRuler() {
			const { width, height } = box;
			const { pixel } = context.state.chart.scale;
			const x = width - RULER_WIDTH - PADDING;
			const startY = height - PADDING - pixel;
			const endY = height - PADDING;

			oRuler
				.clear()
				.lineStyle(1, 0x000000, 1, 0)
				.moveTo(x, startY)
				.lineTo(width - PADDING, startY)
				.lineTo(width - PADDING, endY)
				.lineTo(x, endY);

			oRulerShadow
				.clear()
				.lineStyle(1, 0x000000, 1, 0)
				.moveTo(x, startY)
				.lineTo(width - PADDING, startY)
				.lineTo(width - PADDING, endY)
				.lineTo(x, endY);

			hRuler.x = x;
			hRuler.y = PADDING;
			hRuler.height = height;
			hRuler.width = RULER_WIDTH;
		}

		function drawVolt() {
			const { width, height } = box;

			oVolt.text = voltString(context.state.chart.scale.microvolt);
			oVolt.y = height - oVolt.height - PADDING;
			oVolt.x = -(oVolt.width - (width - MARGIN - RULER_WIDTH - PADDING));
		}

		oRuler
			.on('mouseover', () => {
				context.state.hover = 'scale-ruler';
				oRulerShadow.visible = true;
			})
			.on('mouseout', () => {
				context.state.hover = 'global';
				oRulerShadow.visible = false;
			});

		oVolt
			.on('mouseover', () => {
				context.state.hover = 'scale-volt';
				sVolt.dropShadow = true;
			})
			.on('mouseout', () => {
				context.state.hover = 'global';
				sVolt.dropShadow = false;
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