import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';

const FONT_SIZE = 16;

function verticalCenter(oText, containerHeight) {
	return Math.ceil((containerHeight - oText.height) / 2);
}

export class TitleDevice extends Box {
	created() {
		const box = this;
		const { context, container } = this;
		const oDevice = new Text('无设备', {
			fontSize: FONT_SIZE,
			fontFamily: 'Microsoft Yahei',
			fill: 0x0000FF
		});

		container.addChild(oDevice);

		function renderTitle() {
			oDevice.text = context.state.title.text;
			oDevice.y = verticalCenter(oDevice, box.height);
		}

		context
			.on('title-change', renderTitle)
			.on('mounted', renderTitle);
	}
}

function Prefix0(num, length = 2) {
	return ('0000' + num).slice(-length);
}

/**
 * @param {Date} date
 */
export function getFullDatatimeString(date) {
	const h = date.getHours();
	const m = date.getMinutes();
	const s = date.getSeconds();
	const ms = date.getMilliseconds();

	return `${date.toLocaleDateString()} ${Prefix0(h)}:${Prefix0(m)}:${Prefix0(s)}.${Math.trunc(ms / 100)}`;
}

export class TitleDate extends Box {
	created() {
		const oDate = new Text('', {
			fontSize: FONT_SIZE, fontFamily: 'Consolas', align: 'right'
		});

		this.container.addChild(oDate);

		this.context
			.on('mounted', () => oDate.y = verticalCenter(oDate, this.height))
			.setInterval(() => {
				oDate.text = getFullDatatimeString(new Date());
				oDate.x = this.width - oDate.width;
			}, 50);
	}
}

export class Title extends Box {
}