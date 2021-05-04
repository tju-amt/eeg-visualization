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
		const proxy = ContextProxy(this);

		this.app = app;
		this.debug = true;
		this.mounted = true;
		this.state = {};
		this.watching = watching;
		this.timerId = 0;

		// Object.preventExtensions(this);

		this.app.ticker.add(() => {
			const now = Date.now();

			for (const event in watching) {
				const { checker, listeners, scope } = watching[event];

				if (checker(proxy, scope, now )) {
					listeners.forEach(listener => listener(proxy, now));
				}
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
		console.log(event);
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

			if (index !== -1) {
				listeners.splice(index, 1);
			}
		}

		return this;
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
