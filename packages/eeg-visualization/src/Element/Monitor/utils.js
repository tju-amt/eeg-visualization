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