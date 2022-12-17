<template>
	<RouterLink :to="to" class="button-create" v-if="to">
		<span>+</span>
		{{ create_name }}
	</RouterLink>
	<button :to="to" class="button-create" v-else>
		<span>+</span>
		{{ create_name }}
	</button>
</template>

<script setup lang="ts">
defineProps<{ create_name: string; to?: string }>();
</script>

<style lang="scss" scoped>
.button-create {
	background-color: var(--c__orange);
	border: 0;
	padding: 0.7rem 2rem;
	color: var(--c__white);
	display: flex;
	align-items: center;
	font-size: 1.5rem;
	line-height: 1.5rem;
	border-radius: 0.7rem;
	cursor: pointer;

	span {
		margin-right: 0.8rem;
	}
}
</style>