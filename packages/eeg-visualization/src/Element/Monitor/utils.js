function Prefix0(num, length = 2) {
	return ('0000' + num).slice(-length);
}

/**
 *
 * @param {Date} date
 */
export function getFullTimeString(date) {
	const h = date.getHours();
	const m = date.getMinutes();
	const s = date.getSeconds();
	const ms = date.getMilliseconds();

	return `${Prefix0(h)}:${Prefix0(m)}:${Prefix0(s)}.${Prefix0(ms, 3)}`;
}

function getDigit(number) {
	let digit = 0;

	while (number >= 10) {
		number /= 10;
		digit++;
	}

	return digit;
}

const POSITIONS = [2, 5, 10];

function getStep(number) {
	const digit = getDigit(number);
	const level = Math.pow(10, digit);
	const topDigit = Math.trunc(number / level);
	const pos = POSITIONS.find(pos => pos > topDigit);

	return level * pos;
}

export function getTimelinePostion(width, tagLength, start, end) {
	const mark = { primary: [], secondary: [] };

	if (width < 1) {
		console.warn('too short');

		return mark;
	}

	const tagHolderWidth = tagLength * 1.2;
	const primaryNumber = Math.ceil(width / tagHolderWidth);
	const duration = end - start;
	const primaryStep = getStep(duration / primaryNumber);
	const secondaryStep = primaryStep / 10;
	const length = Math.trunc(duration / secondaryStep);
	const realStart = Math.ceil(start / secondaryStep) * secondaryStep;

	for (let index = 0; index < length; index++) {
		const current = realStart + index * secondaryStep;

		mark.secondary.push(current);

		if (current % primaryStep === 0) {
			mark.primary.push(current);
		}
	}

	return mark;
}

const CHANNEL = {
	FONT_SIZE: { MAX: 20, MIN: 8 },
	FONT_RATIO: 0.6,
	CATEGORY_MARGIN: 10,
	SPACE_NUMBER: 1,
	VALUE_LENGTH: 6
};

export function computeLayout(totalHeight, scrollerLength, { common, top, bottom }) {
	const state = {
		maxName: 0,
		maxReference: 0
	};

	common.forEach(channel => {
		state.maxName = Math.max(channel.name.length, state.maxName);
		state.maxReference = Math.max(channel.reference.join(',').length, state.maxReference);
	});

	const commonTotalHeight = totalHeight -
		(top.length === 0 ? 0 : CHANNEL.CATEGORY_MARGIN) -
		(bottom.length === 0 ? 0 : CHANNEL.CATEGORY_MARGIN);

	const minChannelHeight = Math.max(
		Math.min(Math.trunc(commonTotalHeight / common.length), CHANNEL.FONT_SIZE.MAX),
		CHANNEL.FONT_SIZE.MIN
	);

	const maxCommonChannelNumberInView = Math.floor(commonTotalHeight / minChannelHeight);
	const realCommonLength = Math.min(maxCommonChannelNumberInView, scrollerLength);

	const channelHeight = Math.max(
		Math.min(Math.trunc(commonTotalHeight / realCommonLength), CHANNEL.FONT_SIZE.MAX),
		minChannelHeight
	);

	return {
		channelHeight,
		maxNameLength: state.maxName,
		labelWidth: Math.ceil(
			(state.maxName + state.maxReference + CHANNEL.SPACE_NUMBER) *
			channelHeight * CHANNEL.FONT_RATIO
		),
		valueWidth: Math.ceil(channelHeight * CHANNEL.VALUE_LENGTH  * CHANNEL.FONT_RATIO),
		maxCommonChannelNumberInView
	};
}