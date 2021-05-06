/**
 * @param {import('./').Context} context
 */
export function install(context) {
	context.watch((context, scope) => {
		const { resizeTo: element } = context.app;

		if (element !== scope.element) {
			scope.element = element;

			if (element !== null) {
				scope.height = element.offsetHeight;
				scope.width = element.offsetWidth;
				context.emit('resize');
			} else {
				scope.height = null;
				scope.width = null;
				scope.element = null;
			}
		} else {
			let changed = false;

			if (element.offsetHeight !== scope.height) {
				scope.height = element.offsetHeight;
				context.emit('resize-height');
				changed = true;
			}

			if (element.offsetWidth !== scope.width) {
				scope.width = element.offsetWidth;
				context.emit('resize-width');
				changed = true;
			}

			if (changed) {
				context.emit('resize');
			}
		}
	}, { element: null, height: 0, width: 0 });

	context.watch((context, scope) => {
		if (context.debug !== scope.debug) {
			scope.debug = context.debug;
			context.emit(scope.debug ? 'debug-on' : 'debug-off');
		}
	}, { debug: null });

	context.watch((context, scope) => {
		if (context.mounted !== scope.flag) {
			scope.flag = context.mounted;
			context.emit(scope.flag ? 'mounted': 'unmounted');
		}
	}, { flag: null });

	context.watch((context, _scope, now) => {
		const { intervals, timeouts } = context.watching.timer;

		for(const timerId in intervals) {
			const task = intervals[timerId];

			if (now > task.calledAt + task.ms) {
				task.fn();
				task.calledAt = now;
			}
		}

		for(const timerId in timeouts) {
			const task = timeouts[timerId];

			if (now > task.createdAt + task.ms) {
				task.fn();
				delete timeouts[timerId];
			}
		}
	});
}
