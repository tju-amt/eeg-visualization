import * as PIXI from 'pixi.js';
import { Context } from './Context';

export class Viewport {
	constructor() {
		const app = new PIXI.Application({
			backgroundColor: 0xfcfcfc,
			backgroundAlpha: 1,
			antialias: true,
			autoDensity: true
		});

		this.app = app;
		this.context = new Context(app);

		this.container = new PIXI.Container();
		this.children = [];

		app.stage.addChild(this.container);

		const oFPS = new PIXI.Text('00', {
			fontSize: 16,
			fontWeight: 'bold',
			fontFamily: 'Consolas',
			fill: 0xFFFF00,
			stroke: 0x000000,
			strokeThickness: 4,
		});

		app.stage.addChild(oFPS);

		this.observer = this.context
			.on('debug-on', () => oFPS.visible = true)
			.on('debug-off', () => oFPS.visible = false)
			.on('resize', () => app.resize())
			.setInterval(() => oFPS.text = `${Math.round(app.ticker.FPS)}`, 1000);

		Object.freeze(this);
	}

	get top() {
		return 0;
	}

	get left() {
		return 0;
	}

	get height() {
		return this.context.mounted ? this.app.view.height : 0;
	}

	get width() {
		return this.context.mounted ? this.app.view.width : 0;
	}

	appendChild(box) {
		box.parent = this;
		this.children.push(box);
		this.container.addChild(box.container);
	}

	mount(element) {
		element.appendChild(this.app.view);
		this.app.resizeTo = element;
		this.app.resize();

		this.container.x = 0;
		this.container.y = 0;

		this.context.mounted = true;

		return this;
	}

	destroy() {
		this.context.mounted = false;
		this.app.destroy();
	}

	createBox(BoxClass) {
		return new BoxClass(this.context);
	}
}
