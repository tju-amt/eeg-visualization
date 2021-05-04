import Outline from './Outline';
import Mask from './Mask';
import { StyleSheet, STYLE_ATTRIBUTE_NAME_LIST } from './StyleSheet';
import { Container, Rectangle, Ticker } from 'pixi.js';

export class Box {
	constructor(name, context, app) {
		const container = new Container();
		const hitArea = new Rectangle();

		container.hitArea = hitArea;

		this.name = name;
		this.app = app;
		this.style = new StyleSheet();
		this.container = container;
		this.hitArea = hitArea;

		this.children = [];
		this.parent = null;
		this.context = context;

		this.mask = Mask(this);
		this.outline = Outline(this);

		Ticker.shared.add(() => {
			this.outline.visible = this.context.debug;
		});

		// Object.freeze(this);
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

		const { height, width, top, left } = this;

		this.hitArea.height = height;
		this.hitArea.width = width;
		this.container.x = left;
		this.container.y = top;
		this.mask.update();
		this.children.forEach(box => box.render());

		if (this.context.debug) {
			this.outline.render();
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
