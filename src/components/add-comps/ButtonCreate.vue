<template>
	<RouterLink :to="to" class="button-create" v-if="to">
		<p>
			<span>+</span>
			<slot></slot>
		</p>
	</RouterLink>
	<button :to="to" class="button-create" v-else>
		<p>
			<span>+</span>
			<slot></slot>
		</p>
	</button>
</template>

<script setup lang="ts">
defineProps<{ to?: string }>();
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.button-create {
	background-color: $--c__orange;
	border: 0;
	padding: 0.7rem 2rem;
	color: $--c__white;
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