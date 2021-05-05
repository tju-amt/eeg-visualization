import { Container, Rectangle } from "pixi.js";
import { Viewport } from '../Viewport';
import { Context } from '../Context';

export class Box {
	readonly container: Container;
	readonly hitArea: Rectangle;
	readonly name: string;
	readonly style: StyleSheet;
	readonly children: Box[];

	parent: Box | Viewport | null;
	context: Context;
	mask: object;
	outline: object;

	readonly top: 0;
	readonly left: 0;
	readonly height: number;
	readonly width: number;

	appendChild(box: Box): void;
	render(): void;
	setStyle(styleObject): this;
	created(): unknown;
}