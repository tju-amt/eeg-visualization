import Outline from './Outline';
import Mask from './Mask';
import { StyleSheet, STYLE_ATTRIBUTE_NAME_LIST } from './StyleSheet';
import { Container, Rectangle } from 'pixi.js';

export class Box {
	constructor(context) {
		const container = new Container();
		const hitArea = new Rectangle();

		container.hitArea = hitArea;

		this.style = new StyleSheet();
		this.container = container;
		this.hitArea = hitArea;

		this.children = [];
		this.parent = null;
		this.events = {};
		this.context = context;

		this.mask = Mask(this);
		this.outline = Outline(this);

		context
			.on('debug-off', () => this.outline.visible = false)
			.on('debug-on', () => this.outline.visible = true)
			.on('resize', () => this.render());

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

	render() {
		const { height, width, top, left } = this;

		this.hitArea.height = height;
		this.hitArea.width = width;
		this.container.x = left;
		this.container.y = top;
		this.mask.update();
		this.outline.render();
		this.emit('render');
	}

	on(event, callback) {
		if (!this.events[event]) {
			this.events[event] = [];
		}

		this.events[event].push(callback);

		return this;
	}

	emit(event) {
		const listenerList = this.events[event];

		if (Array.isArray(listenerList)) {
			listenerList.forEach(callback => callback(this));
		}
	}

	// off(event, callback) {

	// }

	setStyle(styleObject) {
		STYLE_ATTRIBUTE_NAME_LIST.forEach(name => {
			if (styleObject[name] !== undefined) {
				this.style[name] = styleObject[name];
			}
		});

		if (this.parent !== null && this.context.mounted) {
			this.render();
		}

		return this;
	}

	created() {}
}
