/**
 *
 * @param {*} ElementClassMap
 * @param {*} layout
 * @param {import('./Viewport').Viewport} viewport
 */
export function assembly(ElementClassMap, layout, viewport) {
	const map = {};

	(function build(ElementList, parent) {
		ElementList.forEach(element => {
			const { className, style, children, as } = element;
			const ElementClass = ElementClassMap[className];

			if (ElementClass === undefined) {
				throw new Error(`An element class named "${className}" is NOT defined.`);
			}

			const box = viewport.createBox(ElementClass);

			box.setStyle(style);
			parent.appendChild(box);

			if (as) {
				map[as] = box;
			}

			if (Array.isArray(children)) {
				build(children, box);
			}
		});
	}(layout, viewport));

	return map;
}
