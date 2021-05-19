import { Box } from 'pixijs-box';
import { Graphics, LineStyle } from 'pixi.js';

const WAVE_LINE_STYLE = new LineStyle();

WAVE_LINE_STYLE.clone = 0x0000FF;
WAVE_LINE_STYLE.width = 1;
WAVE_LINE_STYLE.alignment = 1;

export class Wave extends Box {
	created() {
		const box = this;
		const { container, context } = box;
		const oWaveList = [];

		function clearAll() {
			oWaveList.forEach(oWave => oWave.destroy());
			oWaveList.length = 0;
		}

		function render() {
			clearAll();

			const { width } = box;
			const { channel, chart } = context.state;
			const { display: channelList, config, timeList } = channel;
			const { fontSize } = config;
			const { start, end } = chart.timeline;
			const { pixel, microvolt } = chart.scale;
			const duration = end - start;
			const startY = fontSize / 2;

			channelList.forEach((channel, index) => {
				const oWave = new Graphics();
				const { data } = channel;

				container.addChild(oWave);
				oWaveList.push(oWave);
				oWave.y = index * fontSize;

				oWave.clear().lineStyle(1, 0x0000FF).moveTo(0, startY);



				data.forEach((volt, index) => {
					const x = (timeList[index] - start) / duration * width + 1;
					const y = (volt - -microvolt) / (2 * microvolt) * pixel - pixel / 2 + fontSize / 2;

					oWave.lineTo(x, y);
				});
			});
		}

		context
			.on('channel-display-change', render)
			.on('scale-pixel-change', render)
			.on('scale-microvolt-change', render);
	}
}