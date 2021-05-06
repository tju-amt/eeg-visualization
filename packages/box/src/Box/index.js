import Outline from './Outline';
import Mask from './Mask';
import { StyleSheet, STYLE_ATTRIBUTE_NAME_LIST } from './StyleSheet';
import { Container, Rectangle } from 'pixi.js';

export class Box {
	constructor(context) {
		const container = new Container();
		const hitArea = new Rectangle();
		const box = this;

		container.hitArea = hitArea;

		this.style = new StyleSheet();
		this.container = container;
		this.hitArea = hitArea;

		this.children = [];
		this.parent = null;
		this.context = context;

		const mask = Mask(this);
		const outline = Outline(this);

		const render = () => {
			const { height, width, top, left } = box;

			hitArea.height = height;
			hitArea.width = width;
			container.x = left;
			container.y = top;
			mask.update();
			outline.render();
		};

		context
			.on('debug-off', () => outline.visible = false)
			.on('debug-on', () => outline.visible = true)
			.on('resize', () => render());

		this.created();
	}

	get name() {
		return this.constructor.name;
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

	appendChild(box) {
		box.parent = this;
		box.context = this.context;
		this.children.push(box);
		this.container.addChild(box.container);
	}

	setStyle(styleObject) {
		STYLE_ATTRIBUTE_NAME_LIST.forEach(name => {
			if (styleObject[name] !== undefined) {
				this.style[name] = styleObject[name];
			}
		});

		return this;
	}

	created() {}
}
