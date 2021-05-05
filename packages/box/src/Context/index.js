import { install } from './preset';

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
		const watching = {};
		const everytime = {};
		const proxy = ContextProxy(this);

		this.app = app;
		this.debug = true;
		this.mounted = true;
		this.state = {};
		this.watching = watching;
		this.everytime = everytime;
		this.timerId = 0;

		// Object.preventExtensions(this);

		this.app.ticker.add(() => {
			const now = Date.now();

			for (const event in watching) {
				const { checker, listeners, scope } = watching[event];

				checker(proxy, scope, now) && listeners.forEach(listener => listener());
			}

			for (const fn in everytime) {
				everytime[fn]();
			}
		});

		install(this);
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
		this.watching[event].listeners.push(listener);

		return this;
	}

	off(event, listener) {
		const { listeners } = this.watching[event];

		if (listeners) {
			const index = listeners.indexOf(listener);

			index !== -1 && listeners.splice(index, 1);
		}

		return this;
	}

	setFrame(callback) {
		const id = `f${this.timerId++}`;

		this.everytime[id] = callback;

		return id;
	}

	clearFrame(id) {
		delete this.everytime[id];
	}

	setInterval(callback, ms) {
		const id = `i${this.timerId++}`;

		this.watch(id, (_context, scope, now) => {
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

	clearInterval(id) {
		this.unwatch(id);
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
	clearTimeout(id) {
		this.unwatch(id);
	}
}
