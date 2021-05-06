import { Application } from 'pixi.js';

declare namespace Context {
	interface State {}

	namespace Watching {
		type Expression = (context: Context, scope: Scope, now: number) => boolean;
		type Listener = () => unknown;
		type ListenerList = Listener[];

		interface Scope {
			[key: string]: any;
		}

		interface Task {
			/**
			 * A function describing how and when dispatching this event
			 * by returning `true`.
			 */
			expression: Expression;

			/**
			 * An isolating data object for expression to check current state with
			 * the previous state.
			 */
			scope: Scope;
		}

		interface TaskMap {
			[id: string]: Task;
		}

		namespace Timer {
			interface IntervalTask {
				fn: TimerCallback;
				ms: number;
				calledAt: number;
			}

			interface TimeoutTask {
				fn: TimerCallback;
				ms: number;
				createdAt: number;
			}

			interface IntervalMap {
				[id: string]: IntervalTask;
			}

			interface TimeoutMap {
				[id: string]: TimeoutTask;
			}
		}

		interface TimerNamespace {
			intervals: Timer.IntervalMap,
			timeouts: Timer.TimeoutMap
		}
	}

	interface Watching {
		id: number;
		tasks: Watching.TaskMap;
		events: Watching.ListenerList;
		timer: Watching.TimerNamespace;
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

	/**
	 *
	 * @param event
	 * @param expression
	 * @param initScope
	 */
	watch(expression: Context.Watching.Expression, initScope?: Context.Watching.Scope): Context.TimerId;

	/**
	 *
	 * @param id
	 */
	unwatch(id: string): void;

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

	emit(event: string): this;

	/**
	 *
	 * @param callback
	 * @param ms
	 */
	setInterval(callback: Context.TimerCallback, ms: number): Context.TimerId;

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
	setTimeout(callback: Context.TimerCallback, ms: number): Context.TimerId;

	/**
	 *
	 * @param id
	 */
	clearTimeout(id: Context.TimerId): void;
}