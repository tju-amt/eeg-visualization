<template>
	<div id="app">
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

export default {
	name: 'App',
	data() {
		return {
			width: 800,
			height: 600
		};
	},
	components: {
	},
	methods: {
		resize() {
			this.width = 1200;
			this.height = 900;
			this.$nextTick(() => this._egg.resize());
		}
	},
	mounted() {
		const eeg = window.eeg = this._egg = EEG();

		eeg.install(this.$refs.eeg);
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
