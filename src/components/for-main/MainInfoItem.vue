<template>
	<div
		class="item"
		:style="`background: linear-gradient(180deg, ${color_from} 0%, ${color_to} 100%);`"
	>
		<p class="item__value">{{ value }}</p>
		<p class="item__text">{{ text }}</p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	value: number | string;
	text: string;
	color_from: string;
	color_to: string;
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 100%;
	padding: 2rem;
	border-radius: 2rem;
	aspect-ratio: 393 / 166;
	max-width: 100%;
	width: 100%;
	height: auto;
	text-align: center;

	&__value {
		font: {
			size: 1.8rem;
			weight: bold;
		}
	}

	&__text {
		font: {
			size: 1.6rem;
			weight: bold;
		}
	}
}
</style>