<template>
	<div class="loader">
		<IconLoader />
	</div>
</template>

<script lang="ts" setup>
import IconLoader from "@icons/IconLoader.vue";
</script>

<style lang="scss">
.loader {
	width: 100%;
	flex: 1;
	display: flex;
	justify-content: center;

	svg {
		width: 10rem;
		height: 10rem;
		fill: var(--c__violet);
		animation: rotate 1.5s linear 0s infinite;
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(-360deg);
	}
}
</style>