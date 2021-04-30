import * as PIXI from 'pixi.js';
import { Box } from './Box';

export class Viewport {
	constructor() {
		this.app = new PIXI.Application({
			backgroundColor: 0xfcfcfc,
			backgroundAlpha: 1,
			antialias: false,
			autoDensity: true
		});

		this.context = {
			debug: true,
			mounted: false
		};

		this.container = new PIXI.Container();
		this.children = [];

		this.app.stage.addChild(this.container);
		Object.freeze(this);
	}

	get top() {
		return 0;
	}

	get left() {
		return 0;
	}

	get height() {
		return this.app.view.height;
	}

	get width() {
		return this.app.view.width;
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
		this.app.destroy();
	}

	createBox(name = '<none>') {
		const box = new Box();

		box.context = this.context;
		box.name = name;

		return box;
	}
}
