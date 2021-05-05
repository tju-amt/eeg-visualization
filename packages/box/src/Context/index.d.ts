import { Application } from 'pixi.js';

declare namespace Context {
	interface State {}

	namespace Watching {
		type Checker = (context: ContextProxy, scope: Scope, now: number) => boolean;
		type Listener = () => unknown;

		interface Scope {
			[key: string]: any;
		}

		interface Task {
			/**
			 * A function describing how and when dispatching this event
			 * by returning `true`.
			 */
			checker: Checker;

			/**
			 * All listeners of this event.
			 */
			listeners: Listener[];

			/**
			 * An isolating data object for checker to check current state with
			 * the previous state.
			 */
			scope: Scope;
		}
	}

	interface Watching {
		[event: string]: Task
	}

	interface ContextProxy {
		readonly app: Application;
		readonly debug: boolean;
		readonly mounted: boolean;
		readonly state: Context.State;
	}

	type TimerId = string;
	type TimerCallback = () => {};
}

export class Context {
	constructor(app: Application);

	app: Application;
	debug: boolean;
	mounted: boolean;
	state: Context.State;

	watching: Context.Watching;
	timerId: number;

	/**
	 *
	 * @param event
	 * @param checker
	 * @param initScope
	 */
	watch(event: string, checker: Context.Watching.Checker, initScope?: Context.Watching.Scope): this;

	/**
	 *
	 * @param event
	 */
	unwatch(event: string): this;

	/**
	 *
	 * @param event
	 * @param listener
	 */
	on(event: string, listener: Context.Watching.Listener): this;

	/**
	 *
	 * @param event
	 * @param listener
	 */
	off(event: string, listener: Context.Watching.Listener): this;

	/**
	 *
	 * @param callback
	 * @param ms
	 */
	setInterval(callback: TimerCallback, ms: number): Context.TimerId;

	/**
	 *
	 * @param id
	 */
	clearInterval(id: Context.TimerId): void;

	/**
	 *
	 * @param callback
	 * @param ms
	 */
	setTimeout(callback: TimerCallback, ms: number): Context.TimerId;

	/**
	 *
	 * @param id
	 */
	clearTimeout(id: Context.TimerId): void;

	setFrame(callback): Context.TimerId;

	clearFrame(id: Context.TimerId): void;
}