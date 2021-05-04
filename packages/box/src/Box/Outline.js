import { Graphics, Text, TextStyle, Circle } from 'pixi.js';

const ID_FONT = new TextStyle({
	fontFamily: 'Consolas',
	fontSize: 10,
	fill: '#000000'
});

const HANDLER_RADIUS = 6;

export default function Outline(box) {
	const oRect = new Graphics();
	const oId = new Text('', ID_FONT);
	const hitArea = new Circle(0, 0, HANDLER_RADIUS);

	box.container.addChild(oRect);

	oId.visible = false;
	oId.x = 4;

	oRect.interactive = true;
	oRect.buttonMode = true;
	oRect.hitArea = hitArea;
	oRect.addChild(oId);

	oRect
		.on('mouseover', () => oId.visible = true)
		.on('mouseout', () => oId.visible = false);

	return {
		set visible(value) {
			oRect.visible = value;
		},
		get visible() {
			return oRect.visible;
		},
		render() {
			const center = { x: box.width / 2, y: box.height / 2 };

			hitArea.x = center.x;
			hitArea.y = center.y;
			oId.text = box.name;

			oRect
				.clear().lineStyle(1, 0x666666, 1, 0)
				.beginFill(0x000000, 0.05)
				.drawRect(0, 0, box.width, box.height)
				.beginFill(0x0000FF, 0.3)
				.drawCircle(center.x, center.y, HANDLER_RADIUS);
		}
	};
}