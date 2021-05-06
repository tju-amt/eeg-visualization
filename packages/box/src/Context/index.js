import { install } from './preset';

export class Context {
	constructor(app) {
		this.app = app;
		this.debug = true;
		this.mounted = true;
		this.state = {};

		this.watching = Object.preventExtensions({
			id: 0,
			tasks: {},
			events: {},
			timer: Object.freeze({
				intervals: {},
				timeouts: {}
			})
		});

		this.app.ticker.add(() => {
			const now = Date.now();

			for (const taskId in this.watching.tasks) {
				const { expression, scope } = this.watching.tasks[taskId];

				expression(this, scope, now);
			}
		});

		install(this);
	}

	watch(expression, initScope = {}) {
		const id = `w-${this.watching.id++}`;

		this.watching.tasks[id] = {
			expression,
			scope: Object.assign({}, initScope)
		};

		return id;
	}

	unwatch(id) {
		delete this.watching.tasks[id];
	}

	on(event, listener) {
		if (!Array.isArray(this.watching.events[event])) {
			this.watching.events[event] = [];
		}

		this.watching.events[event].push(listener);

		return this;
	}

	off(event, listener) {
		if (listener === undefined) {
			delete this.watching.events[event];
		} else {
			const { listeners } = this.watching.events[event];

			if (listeners) {
				const index = listeners.indexOf(listener);

				index !== -1 && listeners.splice(index, 1);
			}
		}

		return this;
	}

	emit(event) {
		const listenerList = this.watching.events[event];

		if (Array.isArray(listenerList)) {
			listenerList.forEach(listener => listener(this));
		}

		return this;
	}

	setInterval(callback, ms) {
		const id = `i-${this.watching.id++}`;

		this.watching.timer.intervals[id] = {
			fn: callback,
			ms,
			calledAt: Date.now()
		};

		return id;
	}

	clearInterval(id) {
		delete this.watching.timer.intervals[id];
	}

	setTimeout(callback, ms) {
		const id = `t-${this.watching.id++}`;

		this.watching.timer.timeouts[id] = {
			fn: callback,
			ms,
			createdAt: Date.now()
		};

		return id;
	}

	clearTimeout(id) {
		delete this.watching.timer.timeouts[id];
	}
}
