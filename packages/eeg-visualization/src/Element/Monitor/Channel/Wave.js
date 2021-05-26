import { Box } from 'pixijs-box';
import { Graphics, Text } from 'pixi.js';
import { computeGlobalOffset } from './utils';
import { getFullTimeString } from '../utils';

const INIT_TIME = '00:00:00.000';

function ScannerComponent() {
	const oScanner = new Graphics();
	const oCurrent = new Text(INIT_TIME, { fontSize: 12, fontFamily: 'Consolas', strokeThickness: 4,stroke: 0xffffff });

	oScanner.addChild(oCurrent);

	return { oScanner, oCurrent };
}
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
		const { CHART_PADDING_BOTTOM } = context.state.SIZE;
		const oWaveList = [];
		const { oCurrent, oScanner } = ScannerComponent();
		const bounds = { x: 0, width: 0 };

		let debounceTimer = null;

		container.addChild(oScanner);
		container.interactive = true;
		container
			.on('mousemove', event => {
				clearTimeout(debounceTimer);

				const x = Math.min(Math.max(event.data.global.x - bounds.x, 0), bounds.width);
				const { timeline, tooltip } = context.state.chart;
				const { start, end } = timeline;
				const currentTimestamp = Math.trunc(x / bounds.width * (end - start) + start);
				const currentDate = new Date(currentTimestamp);

				oScanner.x = x;
				oCurrent.text = getFullTimeString(currentDate);
				debounceTimer = setTimeout(() => tooltip.setPosition(currentTimestamp), 30);
			});

		function clearAll() {
			oWaveList.forEach(oWave => oWave.destroy());
			oWaveList.length = 0;
		}

		function drawScanner() {
			oScanner
				.clear().lineStyle(1, 0x000000, 1)
				.moveTo(0, 0).lineTo(0, box.height - CHART_PADDING_BOTTOM)
				.x = 0;

			oCurrent.y = box.height + 4 - CHART_PADDING_BOTTOM;
			oCurrent.x = -oCurrent.width / 2;
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

			oScanner.visible = false;
			bounds.x = container.getBounds().x;
			bounds.width = container.getBounds().width;
			oScanner.visible = true;
		}

		context
			.on('channel-display-change', render)
			.on('scale-pixel-change', render)
			.on('scale-microvolt-change', render)
			.on('channel-layout-change', drawScanner);
	}
}