import { Graphics } from 'pixi.js';

export default function Mask(box) {
	const oRect = new Graphics();

	box.container.mask = oRect;
	box.container.addChild(oRect);

	return {
		update() {
			oRect
				.clear().lineStyle(0)
				.drawRect(0, 0, box.width, box.height);
		}
	};
}