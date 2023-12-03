<template>
	<button class="form-button" :class="{ disabled: disabled }" :style="{ 'background-color': color }">
		<slot>Сохранить</slot>
	</button>
</template>

<script setup lang="ts">
const props = defineProps<{
	disabled?: boolean;
	color?: string;
}>();
</script>

<style lang="scss">
@import "@/style.scss";

.form-button {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: $--c__green;
	border: 0;
	color: $--c__white;
	font-size: 1.6rem;
	height: 3.5rem;
	padding: 0 5rem;
	border-radius: 1rem;
	cursor: pointer;

	&.disabled {
		background-color: $--c__grey;
		cursor: auto;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		height: unset;
		font-size: 1.9rem;
		padding: 0.8rem 5rem;
	}
}
</style>