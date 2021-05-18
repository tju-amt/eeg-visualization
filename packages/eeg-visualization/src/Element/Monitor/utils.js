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