import * as PIXI from 'pixi.js';

const STYLE_ATTRIBUTE_NAME_LIST = [
	'top', 'left', 'right', 'bottom',
	'height', 'width'
];

export class PBox {
	constructor(context) {
		this.style = {
			top: 10,
			left: 10,
			right: 10,
			bottom: 10,
			height: null,
			width: null
		};

		this.container = new PIXI.Container();

		this.children = [];
		this.parent = null;
		this.context = context;

		this.mask = new PIXI.Graphics();
		this.container.mask = this.mask;
		this.outline = window.o = new PIXI.Graphics();
		this.container.addChild(this.outline);
	}

	setMask() {
		this.mask.clear().drawRect(this.container.x, this.container.y, this.width, this.height);
	}

	showOutline() {
		this.outline
			.clear().lineStyle(1, 0x666666, 1, 0)
			.drawRect(0, 0, this.width, this.height);
	}

	get top() {
		return this.style.top === null
			? this.parent.height - this.style.bottom - this.style.height
			: this.style.top;
	}

	get left() {
		return this.style.left === null
			? this.parent.width - this.style.right - this.style.width
			: this.style.left;
	}

	get height() {
		return this.style.height === null
			? this.parent.height - this.style.top - this.style.bottom
			: this.style.height;
	}

	get width() {
		return this.style.width === null
			? this.parent.width - this.style.left - this.style.right
			: this.style.width;
	}

	appendBox(box) {
		box.parent = this;
		box.context = this.context;
		this.children.push(box);
		this.container.addChild(box.container);
		box.render();
	}

	render() {
		if (!this.context.mounted) {
			return;
		}

		this.container.x = this.left;
		this.container.y = this.top;
		this.setMask();

		if (this.context.debug) {
			this.showOutline();
		}

		this.children.forEach(box => box.render());
	}

	setStyle(styleObject) {
		STYLE_ATTRIBUTE_NAME_LIST.forEach(name => {
			if (styleObject[name] !== undefined) {
				this.style[name] = styleObject[name];
			}
		});

		this.render();

		return this;
	}
}

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

	createBox() {
		const box = new PBox();

		box.context = this.context;

		return box;
	}
}
