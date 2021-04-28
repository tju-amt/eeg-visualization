import Outline from './Outline';
import Mask from './Mask';
import { Container, Rectangle } from 'pixi.js';

const STYLE_ATTRIBUTE_NAME_LIST = [
	'top', 'left', 'right', 'bottom',
	'height', 'width'
];

export default class PBox {
	constructor(context) {
		this.style = {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			height: null,
			width: null
		};

		this.container = new Container();
		this.name = '';

		this.children = [];
		this.parent = null;
		this.context = context;

		this.mask = Mask(this);
		this.outline = Outline(this);

		this.container.hitArea = this.hitArea = new Rectangle();
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
