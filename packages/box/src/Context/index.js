function ContextProxy(context) {
	return {
		get app() {
			return context.app;
		},
		get debug() {
			return context.debug;
		},
		get mounted() {
			return context.mounted;
		},
		get state () {
			return context.state;
		}
	};
}

export class Context {
	constructor(app) {
		this.app = app;
		this.debug = true;
		this.mounted = true;
		this.state = {};
		this.watching = {};
		this.timerId = 0;

		Object.preventExtensions(this);

		const proxy = ContextProxy(this);

		this.app.ticker.add(() => {
			const now = Date.now();

			for (const event in this.watching) {
				const { checher, listeners, scope } = this.watching[event];

				if (checher(scope, now, proxy)) {
					listeners.forEach(listener => listener(now, proxy));
				}
			}
		});
	}

	watch(event, checker, initScope = {}) {
		this.watching[event] = {
			checker,
			listeners: [],
			scope: Object.assign({}, initScope)
		};

		return this;
	}

	unwatch(event) {
		delete this.watching[event];

		return this;
	}

	on(event, listener) {
		this.watching[event].push(listener);

		return this;
	}

	off(event, listener) {
		const { listeners } = this.watching[event];

		if (listeners) {
			const index = listeners.indexOf(listener);

			if (index !== -1) {
				listeners.splice(index, 1);
			}
		}

		return this;
	}

	setInternal(callback, ms) {
		const id = `i${this.timerId++}`;

		this.watch(id, (scope, now) => {
			if (now > scope.last + ms) {
				scope.last = now;

				return true;
			}

			return false;
		}, {
			last: Date.now()
		}).on(id, () => callback());

		return id;
	}

	setTimeout(callback, ms) {
		const id = `t${this.timerId++}`;
		const from = Date.now();

		this
			.watch(id, (_, now) => now > from + ms)
			.on(id, () => {
				this.unwatch(id);
				callback();
			});

		return id;
	}

	clearInterval(id) {
		this.unwatch(id);
	}

	clearTimeout(id) {
		this.unwatch(id);
	}
}
