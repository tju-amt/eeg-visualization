import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';

const FONT_SIZE = 16;

function verticalCenter(oText, containerHeight) {
	return Math.ceil((containerHeight - oText.height) / 2);
}

export class TitleDevice extends Box {
	created() {
		const oDevice = new Text('无设备', {
			fontSize: FONT_SIZE,
			fontFamily: 'Microsoft Yahei',
			fill: 0x0000FF
		});

		this.container.addChild(oDevice);
		this.context
			.on('mounted', () => oDevice.y = verticalCenter(oDevice, this.height));
	}
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
				oDate.text = new Date().toISOString();
				oDate.x = this.width - oDate.width;
			}, 100);
	}
}

export class Title extends Box {
}