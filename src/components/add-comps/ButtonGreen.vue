<template>
	<button class="form-button" :class="{ disabled: disabled }">
		<slot>Сохранить</slot>
	</button>
</template>

<script setup lang="ts">
const props = defineProps<{
	disabled?: boolean;
}>();
</script>

<style lang="scss" scoped>
@import "../../style.scss";

.form-button {
	background-color: #31ac71;
	border: 0;
	color: var(--c__white);
	font-size: 1.6rem;
	height: 3.5rem;
	padding: 0 5rem;
	border-radius: 1rem;
	cursor: pointer;

	&.disabled {
		background-color: var(--c__grey);
		cursor: auto;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		height: unset;
		font-size: 1.9rem;
		padding: 0.8rem 5rem;
	}
}
</style>