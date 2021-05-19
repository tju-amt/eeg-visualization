import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';

import {
	LabelTextStyle,
	LabelReferenceTextStyle,
	computeGlobalOffset,
	SIZE
} from './utils';

export class Label extends Box {
	get channelHeight() {
		return this.parent.channelHeight;
	}

	get labelWidth() {
		return this.parent.labelWidth;
	}

	get maxNameLength() {
		return this.parent.maxNameLength;
	}

	get commonChannelNumber() {
		return Math.min(
			this.parent.maxCommonChannelNumberInView,
			this.context.state.chart.scroller.length
		);
	}

	get commonChannelList() {
		const length = this.commonChannelNumber;
		const start = this.context.state.chart.scroller.start;

		return this.context.state.channel.common.slice(start, start + length);
	}

	created() {
		const box = this;
		const oLabelList= [];
		const { container, context } = this;

		const TextStyle = {
			label: LabelTextStyle(),
			reference: LabelReferenceTextStyle()
		};

		function clear() {
			oLabelList.forEach(oLabel => oLabel.destroy());
			oLabelList.length = 0;
		}

		function render() {
			clear();

			const { commonChannelList, maxNameLength, channelHeight } = box;
			const globalY = computeGlobalOffset(box.height, commonChannelList.length);

			TextStyle.label.fontSize = TextStyle.reference.fontSize = channelHeight;

			commonChannelList.forEach((channel, index) => {
				const oLabel = new Text(channel.name, TextStyle.label);
				const oReference = new Text(channel.reference.join(','), TextStyle.reference);

				oLabel.addChild(oReference);
				oLabel.y = globalY + index * (channelHeight + SIZE.GUTTER);
				oReference.x = Math.trunc(channelHeight * (maxNameLength + 1) * 0.6);

				container.addChild(oLabel);
				oLabelList.push(oLabel);
			});
		}

		context
			.on('channel-display-change', () => {
				this.setStyle({ width: this.labelWidth });
				render();
			});
	}
}