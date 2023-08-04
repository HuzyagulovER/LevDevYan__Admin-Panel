<template>
	<div class="subscription-item" :style="{ 'background-color': color }">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
const { color } = defineProps<{
	color: string;
}>();
</script>

<style lang="scss">
@import "@/style.scss";

.subscription-item {
	border-radius: 1.6rem;
	padding: 2.2rem 3.5rem;
	display: grid;
	grid-template: 1fr / 1fr 1fr;
	grid-auto-columns: 1fr;
	grid-auto-rows: 1fr;
	column-gap: 0.5rem;
	row-gap: 1rem;
	border: 0.1rem solid $--c__light-violet;
}
</style>