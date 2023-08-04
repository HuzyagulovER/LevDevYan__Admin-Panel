<template>
	<div class="buttons-pages" :data-links-number="props.additionLinksNumber">
		<RouterLink class="buttons-pages__link-psy" :to="{ query: { app: 'psy' } }"
			:class="{ js_active: route.query.app === 'psy' || !route.query.app }">
			PSY
		</RouterLink>
		<RouterLink class="buttons-pages__link-avocado" :to="{ query: { app: 'avocado' } }"
			:class="{ js_active: route.query.app === 'avocado' }">
			Avocado
		</RouterLink>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const props = defineProps<{ additionLinksNumber?: number }>();

const route = useRoute();
</script>

<style lang="scss">
@import "@/style.scss";

.buttons-pages {
	display: flex;

	&>*+* {
		margin-left: 2rem;
	}

	[class*="buttons-pages__link-"] {
		border-radius: 0.7rem;
		border: 0.2rem solid $--c__violet;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 3.25rem;

		&.js_active {
			background-color: $--c__violet;
			color: $--c__white;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		grid-column: 1/7;
		display: grid;
		grid-template: 1fr / 1fr 1fr;
		column-gap: 2.5rem;

		&[data-links-number="1"] {
			grid-template: 1fr / repeat(3, 1fr);
		}

		&>* {
			margin: 0;
		}
	}
}
</style>