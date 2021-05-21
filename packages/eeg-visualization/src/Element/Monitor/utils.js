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
	CATEGORY_MARGIN: 5,
	SPACE_NUMBER: 1,
	VALUE_LENGTH: 6
};

export function computeLayout(height, scrollerLength, { common, top, bottom, all }) {
	const { CATEGORY_MARGIN, FONT_SIZE, SPACE_NUMBER, VALUE_LENGTH, FONT_RATIO } = CHANNEL;
	const fixedLength = top.length + bottom.length;

	/**
	 * Maybe not all channels are used. The sum of length of `common`, `top`, `bottom`
	 * less then the length of `all`.
	 */
	const totalLength = fixedLength + common.length;
	const maxName = Math.max(...all.map(c => c.name.length));
	const maxReference = Math.max(...all.map(c => c.reference.join(',').length));
	const usedHeight = height - (top.length === 0 ? 0 : CATEGORY_MARGIN) - (bottom.length === 0 ? 0 : CATEGORY_MARGIN);
	const minHeight = Math.max(Math.min(Math.trunc(usedHeight / totalLength), FONT_SIZE.MAX), FONT_SIZE.MIN);
	const maxCommonLength = Math.floor(usedHeight / minHeight) - top.length - bottom.length;
	const realCommonLength = Math.min(maxCommonLength, scrollerLength);
	const channelHeight = Math.trunc(usedHeight / (realCommonLength + top.length + bottom.length));

	const commonY = top.length === 0 ? 0 : CATEGORY_MARGIN + channelHeight * top.length;
	const bottomHeight = bottom.length === 0 ? 0 : CATEGORY_MARGIN + channelHeight * bottom.length;
	const commonHeight = height - bottomHeight - commonY;

	return {
		channelHeight,
		maxCommonLength,
		commonLength: realCommonLength,
		maxNameLength: maxName,
		labelWidth: Math.ceil((maxName + maxReference + SPACE_NUMBER) * channelHeight * FONT_RATIO),
		valueWidth: Math.ceil(channelHeight * VALUE_LENGTH  * FONT_RATIO),
		commonY,
		commonHeight,
		bottomY: height - channelHeight * bottom.length
	};
}