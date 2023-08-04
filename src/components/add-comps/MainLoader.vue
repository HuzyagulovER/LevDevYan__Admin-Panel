<template>
	<div class="main-loader">
		<TheLoader class="main-loader__loader" />
	</div>
</template>

<script setup lang="ts">
import TheLoader from "@add-comps/TheLoader.vue";
</script>

<style lang="scss">
@import "@/style.scss";

.main-loader {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba($color: #fff, $alpha: 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;

	.loader {
		flex: auto;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		position: fixed;
	}
}
</style>