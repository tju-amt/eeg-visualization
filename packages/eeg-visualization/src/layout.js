import { SIZE } from './constant';

const {
	TITLE_HEIGHT,
	CHANNEL_LABEL_WIDTH,
	CHANNEL_VALUE_WIDTH,
	NAVIGATOR_HEIGHT,
	GUTTER,
	CHART_PADDING_BOTTOM,
	SCROLLER_WIDTH
} = SIZE;

export default [
	{
		className: 'Title',
		style: {
			top: GUTTER,
			left: GUTTER,
			right: GUTTER,
			height: TITLE_HEIGHT
		},
		children: [
			{
				className: 'TitleDevice',
				style: {
					left: 0,
					width: 120,
					top: 2,
					bottom: 2
				}
			},
			{
				className: 'TitleDate',
				style: {
					left: null,
					right: 0,
					width: 220,
					top: 2,
					bottom: 2
				}
			}
		]
	},
	{
		className: 'Monitor',
		style: {
			top: GUTTER * 2 + TITLE_HEIGHT,
			bottom: GUTTER * 2 + NAVIGATOR_HEIGHT,
			left: GUTTER,
			right: GUTTER
		},
		children: [
			{
				className: 'Label',
				as: 'label',
				style: {
					left: 0,
					top: 0,
					bottom: CHART_PADDING_BOTTOM,
					width: CHANNEL_LABEL_WIDTH
				}
			},
			{
				className: 'Chart',
				style: {
					left: CHANNEL_LABEL_WIDTH + GUTTER,
					right: CHANNEL_VALUE_WIDTH + SCROLLER_WIDTH + 2 * GUTTER,
					top: 0,
					bottom: 0
				},
				children: [
					{
						className: 'Timeline',
						style: {
							left: 0,
							right: 0,
							bottom: 0,
							height: CHART_PADDING_BOTTOM
						}
					},
					{
						className: 'Wave',
						style: {
							top: 0,
							bottom: 0,
							left: 0,
							right: 0
						}
					},
					{
						className: 'Scale',
						style: {
							height: 240,
							width: 80,
							right: GUTTER,
							bottom: GUTTER + CHART_PADDING_BOTTOM
						}
					},
				]
			},
			{
				className: 'Value',
				style: {
					right: SCROLLER_WIDTH + GUTTER,
					top: 0,
					bottom: CHART_PADDING_BOTTOM,
					width: CHANNEL_VALUE_WIDTH
				}
			},
			{
				className: 'Scroller',
				style: {
					right: 0,
					width: SCROLLER_WIDTH,
					top: 0,
					bottom: CHART_PADDING_BOTTOM
				}
			}
		]
	},
	{
		className: 'Navigator',
		style: {
			top: null,
			left: GUTTER,
			right: GUTTER,
			bottom: GUTTER,
			height: NAVIGATOR_HEIGHT
		}
	}
];