/**
 * @param {import('./').Context} context
 */
export function install(context) {
	context
		.watch('resize', (context, scope) => {
			const { resizeTo: element } = context.app;

			let changed = false;

			if (element !== scope.element) {
				changed = true;
			} else if (element !== null) {
				changed =
					element.offsetHeight !== scope.height ||
					element.offsetWidth !== scope.width;
			}

			if (changed) {
				scope.element = element;
				scope.height = element === null ? 0 : element.offsetHeight;
				scope.width = element === null ? 0 : element.offsetWidth;
			}

			return changed;
		}, { element: null, height: 0, width: 0 })
		.watch('debug-open', (context, scope) => {
			if (context.debug !== scope.debug) {
				scope.debug = context.debug;
			}

			return context.debug;
		}, { debug: null })
		.watch('debug-close', (context, scope) => {
			if (context.debug !== scope.debug) {
				scope.debug = context.debug;
			}

			return !context.debug;
		}, { debug: null })
		.watch('mounted', (context, scope) => {
			if (context.mounted !== scope.flag) {
				scope.flag = context.mounted;

				return context.mounted;
			}

			return false;
		}, { flag: null })
		.watch('unmouned', (context, scope) => {
			if (context.mounted !== scope.flag) {
				scope.flag = context.mounted;

				return !context.mounted;
			}

			return false;
		}, { flag: null });
}
