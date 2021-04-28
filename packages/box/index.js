import * as PIXI from 'pixi.js';

const STYLE_ATTRIBUTE_NAME_LIST = [
	'top', 'left', 'right', 'bottom',
	'height', 'width'
];

const idFont = new PIXI.TextStyle({
	fontFamily: 'Arial',
	fontSize: 12,
	fill: '#000000'
});

export class PBox {
	constructor(context) {
		this.style = {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			height: null,
			width: null
		};

		this.container = new PIXI.Container();
		this.name = '<none>';

		this.children = [];
		this.parent = null;
		this.context = context;

		this.mask = new PIXI.Graphics();
		this.outline = window.o = new PIXI.Graphics();
		this.id = new PIXI.Text(this.name, idFont);

		this.container.mask = this.mask;
		this.outline.addChild(this.id);
		this.container.addChild(this.mask, this.outline);
	}

	setMask() {
		this.mask.clear()
			.lineStyle(0)
			.drawRect(0, 0, this.width, this.height);
	}

	showOutline() {
		this.outline
			.clear().lineStyle(1, 0x666666, 1, 0)
			.beginFill(0x000000, 0.05)
			.drawRect(0, 0, this.width, this.height)
			.drawCircle(this.width / 2, this.height / 2, 10)
			.endFill();
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
		this.children.forEach(box => box.render());

		if (this.context.debug) {
			this.showOutline();
		}
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
			antialias: true,
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
