
export default function Coordinate(viewport) {
	const box = viewport.createBox();
	const device = viewport.createBox();

	device.name = 1;
	const datestring = viewport.createBox();

	box.appendBox(device);
	box.appendBox(datestring);

	device.setStyle({ left: 0, width: 120, top: 2, bottom: 2 });
	datestring.setStyle({ left: null, right: 0, width: 220, top: 2, bottom: 2 });

	return {
		box: box
	};
}