
	namespace Channel {
		interface Sample {
			at: number;
			microsecond: number;
			dataList: number[];
		}
	}

	interface ChannelRegistry {
		top: Channel[];
		bottom: Channel[];
		common: Channel[];
		timeList: number[];
	}

	interface Channel {
		name: string;
		referenceList: string[];
		dataList: number[];
		last: number;
	}

	interface ChannelGraphic {
		height: number;
	}