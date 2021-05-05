const TITLE_HEIGHT = 30;
const CHANNEL_LABEL_WIDTH = 120;
const CHANNEL_VALUE_WIDTH = 60;
const NAVIGATOR_HEIGHT = 45;
const GUTTER = 5;
const CHART_PAADDING_BOTTOM = 20;
const SCROLLER_WIDTH = 20;

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
				className: 'ChannelLabel',
				style: {
					left: 0,
					top: 0,
					bottom: CHART_PAADDING_BOTTOM,
					width: CHANNEL_LABEL_WIDTH
				}
			},
			{
				className: 'Chart',
				style: {
					left: CHANNEL_LABEL_WIDTH + GUTTER,
					right: CHANNEL_VALUE_WIDTH + SCROLLER_WIDTH + 2 * GUTTER,
					top: 0,
					bottom: CHART_PAADDING_BOTTOM
				},
				children: [
					{
						className: 'Legend',
						style: {
							height: 120,
							width: 40,
							right: GUTTER,
							bottom: GUTTER
						}
					}
				]
			},
			{
				className: 'LastValue',
				style: {
					right: SCROLLER_WIDTH + GUTTER,
					top: 0,
					bottom: CHART_PAADDING_BOTTOM,
					width: CHANNEL_VALUE_WIDTH
				}
			},
			{
				className: 'Scroller',
				style: {
					right: 0,
					width: SCROLLER_WIDTH,
					top: 0,
					bottom: CHART_PAADDING_BOTTOM
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