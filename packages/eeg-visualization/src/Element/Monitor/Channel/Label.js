import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';
import { LabelTextStyle, LabelReferenceTextStyle, computeGlobalOffset } from './utils';

export class Label extends Box {
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
		const oLabelList= [];
		const { container, context } = this;

		const TextStyle = {
			label: LabelTextStyle(),
			reference: LabelReferenceTextStyle()
		};

		function clearAll() {
			oLabelList.forEach(oLabel => oLabel.destroy());
			oLabelList.length = 0;
		}

		function render() {
			clearAll();

			const { commonChannelList } = box;
			const { maxNameLength, channelHeight, commonHeight, commonY, bottomY } = box.layout;
			const { top: topChannelList, bottom: bottomChannelList } = context.state.channel;

			const commonMiddleOffsetY = computeGlobalOffset(commonHeight, channelHeight, commonChannelList.length);
			const commonInitY = commonMiddleOffsetY + commonY;

			TextStyle.label.fontSize = TextStyle.reference.fontSize = channelHeight;

			function createObjectLabel(channel, index, initY = 0) {
				const oLabel = new Text(channel.name, TextStyle.label);
				const oReference = new Text(channel.reference.join(','), TextStyle.reference);

				oLabel.addChild(oReference);
				oLabel.y = initY + index * channelHeight;
				oReference.x = Math.trunc(channelHeight * (maxNameLength + 1) * 0.6);

				container.addChild(oLabel);
				oLabelList.push(oLabel);
			}

			topChannelList.forEach((channel, index) => createObjectLabel(channel, index));
			commonChannelList.forEach((channel, index) => createObjectLabel(channel, index, commonInitY));
			bottomChannelList.forEach((channel, index) => createObjectLabel(channel, index, bottomY));
		}

		context
			.on('channel-display-change', () => {
				this.setStyle({ width: this.layout.labelWidth });
				render();
			});
	}
}