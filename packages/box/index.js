import * as PIXI from 'pixi.js';
import PBox from './src/Box';
export class PViewport {
	constructor() {
		this.app = new PIXI.Application({
			backgroundColor: 0xfcfcfc,
			backgroundAlpha: 1,
			antialias: false,
			autoDensity: true
		});

		this.context = {
			app: this.app,
			debug: true,
			mounted: false
		};

		this.container = new PIXI.Container();
		this.children = [];

		this.app.stage.addChild(this.container);
	}

	get height() {
		return this.app.view.height;
	}

	get width() {
		return this.app.view.width;
	}

	appendBox(box) {
		box.parent = this;
		box.context = this.context;
		this.container.addChild(box.container);
		this.children.push(box);
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
		const box = new PBox();

		box.context = this.context;
		box.name = name;

		return box;
	}
}
