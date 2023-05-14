<template>
	<div class="buttons-pages">
		<RouterLink
			class="buttons-pages__link-psy"
			:to="{ query: { app: 'psy' } }"
			:class="{ js_active: route.query.app === 'psy' || !route.query.app }"
		>
			PSY
		</RouterLink>
		<RouterLink
			class="buttons-pages__link-avocado"
			:to="{ query: { app: 'avocado' } }"
			:class="{ js_active: route.query.app === 'avocado' }"
		>
			Avocado
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style lang="scss">
.buttons-pages {
	display: flex;

	&__link-psy,
	&__link-avocado {
		border-radius: 0.7rem;
		border: 0.2rem solid var(--c__violet);
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;

		&.js_active {
			background-color: var(--c__violet);
			color: var(--c__white);
		}
	}

	&__link-psy {
		padding: 0.7rem 3.5rem;
		margin-right: 2rem;
	}

	&__link-avocado {
		padding: 0.7rem 3rem;
	}
}
</style>