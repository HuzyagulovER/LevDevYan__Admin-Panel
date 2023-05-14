<template>
	<div
		class="item"
		:style="`background: linear-gradient(180deg, ${color_from} 0%, ${color_to} 100%);`"
	>
		<p class="item__value">{{ value || 0 }}</p>
		<p class="item__text">{{ text }}</p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	value: any;
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

	@supports not (aspect-ratio: 1/1) {
		.item {
			&__value,
			&__text {
				margin: 1rem 0;
			}
		}
	}

	&__value,
	&__text {
		font: {
			weight: bold;
		}
	}

	&__value {
		font: {
			size: 2.4rem;
		}
	}

	&__text {
		font: {
			size: 2rem;
		}
	}
}
</style>