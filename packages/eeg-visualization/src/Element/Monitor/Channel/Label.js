import { Box } from 'pixijs-box';
import { Text } from 'pixi.js';

import {
	LabelTextStyle,
	LabelReferenceTextStyle,
	computeGlobalOffset,
	SIZE
} from './utils';

export class Label extends Box {
	created() {
		const oLabelList= [];
		const { container, context } = this;

		const TextStyle = {
			label: LabelTextStyle(),
			reference: LabelReferenceTextStyle()
		};

		function render() {
			const { display: channelList, config } = context.state.channel;
			const globalY = computeGlobalOffset(container.height, channelList.length);

			oLabelList.forEach(oLabel => oLabel.destroy());

			oLabelList.length = 0;

			channelList.forEach((channel, index) => {
				const oLabel = new Text(channel.name, TextStyle.label);
				const oReference = new Text(channel.reference.join(','), TextStyle.reference);

				oLabel.addChild(oReference);
				oLabel.y = globalY + index * (config.fontSize + SIZE.GUTTER);
				oReference.x = Math.trunc(config.fontSize * (config.maxNameLength + 1) * 0.6);

				container.addChild(oLabel);
				oLabelList.push(oLabel);
			});
		}

		context
			.on('channel-display-change', () => {
				const { fontSize } = context.state.channel.config;

				this.setStyle({ width: context.state.channel.config.labelWidth });
				TextStyle.label.fontSize = TextStyle.reference.fontSize = fontSize;
				render();
			});
	}
}