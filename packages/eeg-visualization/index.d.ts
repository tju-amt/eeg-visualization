namespace State {
	interface Sampling {
		running: boolean;
		span: number;
	}

	namespace Chart {
		interface Scroller {
			length: number;
			start: number;
			readonly step: number;
		}

		interface Scale {
			pixel: number;
			microvolt: number;
			setMicrovolt(up: boolean): void;
		}

		interface Timeline {
			start: number;
			end: number;
		}
	}

	interface Chart {
		scroller: Chart.Scroller;
		scale: Chart.Scale;
		timeline: Chart.Timeline;
	}

	namespace Channel {
		interface ChannelOptions {
			name: string;
			reference: string[];
			style: object;
		}

		interface Options {
			top: ChannelOptions[],
			bottom: ChannelOptions[],
			common: ChannelOptions[]
		}
	}

	interface Channel {
		readonly common: [];
		readonly top: [];
		readonly bottom: [];
		readonly display: [];
		readonly timeList: [];
		readonly options: Channel.Options;
		setup(options: Channel.Options): void;
	}
}

interface State {
	SIZE: object;
	hover: string;
	sampling: State.Sampling;
	chart: State.Chart;
	channel:
}