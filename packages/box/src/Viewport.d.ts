import { Box } from './Box';
import { Application, Container } from 'pixi.js';

declare class Viewport {
	readonly app: Application;
	readonly context: object;
	readonly container: Container;
	readonly children: Box[];

	readonly top: 0;
	readonly left: 0;
	readonly height: number;
	readonly width: number;

	appendChild(box: Box): void;
	render(): void;
	resize(): void;
	mount(element: HTMLElement): this;
	destroy(): void;
	createBox(name?: string): Box;
}