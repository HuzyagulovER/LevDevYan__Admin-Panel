<template>
	<div class="search">
		<InputSearch class="search__input-search" />
		<ButtonCreate :to="`/courses/create-edit/new/about`" class="search__button-create">
			Создать курс
		</ButtonCreate>
	</div>
</template>

<script setup lang="ts">
import InputSearch from "@add-comps/InputSearch.vue";
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import { StoreGeneric, storeToRefs } from "pinia";
import { inject } from "@vue/runtime-core";

const store = <StoreGeneric>inject("Store");
const { courses } = storeToRefs(store);
</script>

<style scoped lang="scss">
@import "@styles/_variables.scss";

.search {
	display: flex;
	margin-bottom: 2rem;
	align-content: stretch;
	height: 3.3rem;

	&__input-search {
		flex: 1;
		fill: $--c__grey;
	}

	&__button-create {
		align-self: stretch;
	}
}
</style>