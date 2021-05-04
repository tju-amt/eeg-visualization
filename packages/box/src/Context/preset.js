/**
 * @param {import('./').Context} context
 */
export function install(context) {
	context
		.watch('resize', (scope, context) => {
			const { resizeTo: element } = context.app;
			const changed = element !== scope.element ||
				element.offsetHeight !== scope.height ||
				element.offsetWidth !== scope.width;

			if (changed) {
				scope.element = element;
				scope.height = element.offsetHeight;
				scope.width = element.offsetWidth;
			}

			return changed;
		}, {
			element: window,
			height: 0,
			width: 0
		}).watch('debug-change', (context, scope) => {
			const changed = context.debug !== scope.debug;

			if (changed) {
				scope.debug = context.debug;
			}

			return changed;
		}, {
			debug: null
		});
}
