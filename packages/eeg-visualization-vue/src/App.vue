<template>
	<div id="app">
		<input type="text" v-model.lazy="width" />
		<input type="text" v-model.lazy="height" />
		<button @click="resize">resize</button>
		<div
			ref="eeg"
			style="position:absolute;display:block;border:1px solid #000"
			:style="{ width: `${width}px`, height: `${height}px` }"
		></div>
	</div>
</template>

<script>
import EEG from '@tjuamt/eeg-visualization';
import { CHANNEL_OPTIONS_SAMPLE } from './dev';

export default {
	name: 'App',
	data() {
		return {
			width: 1200,
			height: 600
		};
	},
	methods: {
		resize() {

		}
	},
	mounted() {
		const eeg = window.eeg = this._egg = EEG();

		eeg.install(this.$refs.eeg);
		eeg.setup(CHANNEL_OPTIONS_SAMPLE);
	},
	destroyed() {
		this._egg.destroy();
	}
};
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
	height: 1200px;
}
</style>
