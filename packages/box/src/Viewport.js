import * as PIXI from 'pixi.js';
import { Box } from './Box';

export class Viewport {
	constructor() {
		const oFPS = new PIXI.Text('--', { fontSize: 16 });
		const app = new PIXI.Application({
			backgroundColor: 0xfcfcfc,
			backgroundAlpha: 1,
			antialias: false,
			autoDensity: true
		});

		this.app = app;
		this.context = {
			debug: true,
			mounted: false
		};

		this.container = new PIXI.Container();
		this.children = [];

		app.stage.addChild(this.container);
		app.stage.addChild(oFPS);

		this.observer = setInterval(() => {
			oFPS.visible = this.context.debug;
			oFPS.text = `${Math.round(app.ticker.FPS)}`;
		}, 1000);

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

	appendBox(box) {
		box.parent = this;
		this.children.push(box);
		this.container.addChild(box.container);
		box.render();
	}

	render() {
		this.children.forEach(box => box.render());
	}

	resize() {
		this.app.resize();
		this.render();
	}

	mount(element) {
		element.appendChild(this.app.view);
		this.app.resizeTo = element;
		this.app.resize();

		this.container.x = 0;
		this.container.y = 0;

		this.context.mounted = true;
		this.render();

		return this;
	}

	destroy() {
		clearInterval(this.observer);
		this.context.mounted = false;
		this.app.ticker.remove();
		this.app.destroy();
	}

	createBox(name = '<none>') {
		return new Box(name, this.context, this.app);
	}
}
