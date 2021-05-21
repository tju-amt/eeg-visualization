import { TextStyle } from 'pixi.js';

const BASE_TEXT_STYLE = {
	LABEL: new TextStyle({
		fontWeight: 'bold',
		fontSize: 8,
		fontFamily: 'Consolas',
		fill: 0x0000ff
	}),
	LABEL_REFERENCE: new TextStyle({
		fontSize: 8,
		fontFamily: 'Consolas',
		fill: 0x3366FF
	}),
	VALUE: new TextStyle({
		fontWeight: 'bold',
		fontSize: 8,
		fontFamily: 'Consolas',
		fill: 0x0000ff
	})
};

export const SIZE = {
	GUTTER: 0
};

export function LabelTextStyle() {
	return BASE_TEXT_STYLE.LABEL.clone();
}

export function LabelReferenceTextStyle() {
	return BASE_TEXT_STYLE.LABEL_REFERENCE.clone();
}

export function ValueTextStyle() {
	return BASE_TEXT_STYLE.VALUE.clone();
}

export function computeGlobalOffset() {
	return 0;
}