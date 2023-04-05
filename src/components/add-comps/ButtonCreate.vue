<template>
	<RouterLink :to="to" class="button-create" v-if="to">
		<p>
			<span>+</span>
			{{ create_name }}
		</p>
	</RouterLink>
	<button :to="to" class="button-create" v-else>
		<p>
			<span>+</span>
			{{ create_name }}
		</p>
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
	line-height: 1.5rem;
	border-radius: 0.7rem;
	cursor: pointer;
	font-size: 1.5rem;

	p {
		text-align: center;
		width: 100%;
	}

	span {
		margin-right: 0.8rem;
	}
}
</style>