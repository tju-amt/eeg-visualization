import { Box } from 'pixijs-box';
import { Graphics, LineStyle } from 'pixi.js';
import { computeGlobalOffset } from './utils';

const WAVE_LINE_STYLE = new LineStyle();

WAVE_LINE_STYLE.clone = 0x0000FF;
WAVE_LINE_STYLE.width = 1;
WAVE_LINE_STYLE.alignment = 1;

export class Wave extends Box {
	get commonChannelList() {
		const length = this.layout.commonLength;
		const start = this.context.state.chart.scroller.start;

		return this.context.state.channel.common.slice(start, start + length);
	}

	get layout() {
		return this.parent.layout;
	}

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

			const { width, commonChannelList } = box;
			const { channelHeight, commonHeight, commonY, bottomY } = box.layout;
			const { channel, chart } = context.state;
			const { top: topChannelList, bottom: bottomChannelList, timeList } = channel;

			const { start, end } = chart.timeline;
			const { pixel, microvolt } = chart.scale;
			const duration = end - start;
			const lineStartY = channelHeight / 2;

			const commonMiddleOffsetY = computeGlobalOffset(commonHeight, channelHeight, commonChannelList.length);
			const commonInitY = commonMiddleOffsetY + commonY;

			function createObjectWave(channel, index, initY = 0) {
				const oWave = new Graphics();
				const { data } = channel;

				container.addChild(oWave);
				oWaveList.push(oWave);
				oWave.y = initY + index * channelHeight;
				oWave.clear().lineStyle(1, 0x0000FF).moveTo(0, lineStartY);

				data.forEach((volt, index) => {
					const x = (timeList[index] - start) / duration * width + 1;
					const y = (volt - -microvolt) / (2 * microvolt) * pixel - pixel / 2 + channelHeight / 2;

					oWave.lineTo(x, y);
				});
			}

			topChannelList.forEach((channel, index) => createObjectWave(channel, index));
			commonChannelList.forEach((channel, index) => createObjectWave(channel, index, commonInitY));
			bottomChannelList.forEach((channel, index) => createObjectWave(channel, index, bottomY));
		}

		context
			.on('channel-display-change', render)
			.on('scale-pixel-change', render)
			.on('scale-microvolt-change', render);
	}
}