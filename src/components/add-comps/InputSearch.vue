<template>
	<div class="input-search">
		<div class="input-search__icon">
			<IconSearch />
		</div>
		<input
			type="search"
			class="input-search__input"
			placeholder="Поиск по названию"
		/>
	</div>
</template>

<script setup lang="ts">
import IconSearch from "@icons/IconSearch.vue";
</script>

<style scoped lang="scss">
@import "../../style.scss";

.input-search {
	width: 100%;
	height: auto;
	position: relative;
	margin-right: 2rem;
	display: flex;
	align-items: center;
	border: 0.1rem solid rgba(0, 0, 0, 0.55);
	border-radius: 0.7rem;
	padding: 0 2.5%;
	background-color: var(--c__light-blue);

	&__icon {
		height: 40%;
		width: 0;
		margin-right: 3%;

		svg {
			width: auto;
			height: 100%;
			object-fit: cover;
		}
	}

	&__input {
		height: 100%;
		flex: 5;
		border: 0;
		background-color: transparent;
		font-size: 1.3rem;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		&__icon {
			height: 50%;
			margin-right: 12%;
		}

		&__input {
			font-size: 1.5rem;
		}
	}
}
</style>