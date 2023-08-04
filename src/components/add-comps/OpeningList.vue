<template>
	<div class="opening-list" ref="openingList" :class="{ opened: isOpened }">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, watch } from "@vue/runtime-core";
import { ComputedRef, ref, Ref } from "@vue/reactivity";

const props = defineProps<{ isOpen: boolean }>();
const openingList: Ref<any> = ref(null);
const isOpened: Ref<boolean> = ref(false);

watch(
	() => props.isOpen,
	() => {
		if (!openingList.value?.classList.contains("opened")) {
			openingList.value.style.height = openingList.value.scrollHeight + "px";
			setTimeout(() => {
				openingList.value.style = "";
				isOpened.value = true;
			}, 300);
		} else {
			openingList.value.style.height = openingList.value.scrollHeight + "px";
			isOpened.value = false;
			setTimeout(() => {
				openingList.value.style = "";
			}, 0);
		}
	}
);
</script>

<style scoped lang="scss">
@import "@/style.scss";

.opening-list {
	height: 0;
	overflow: hidden;
	transition: var(--transition-03);

	&.opened {
		height: auto;
	}
}
</style>