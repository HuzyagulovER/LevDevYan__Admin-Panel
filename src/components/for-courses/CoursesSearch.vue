<template>
	<div class="search">
		<InputSearch class="search__input-search" />
		<ButtonCreate :to="`/courses/create-edit/new/about`" class="search__button-create" @click="createNewCourse">
			Создать курс
		</ButtonCreate>
	</div>
</template>

<script setup lang="ts">
import InputSearch from "@add-comps/InputSearch.vue";
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import { StoreGeneric, storeToRefs } from "pinia";
import { inject } from "@vue/runtime-core";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
const { defaultCourse, courses } = storeToRefs(store);

function createNewCourse() {
	// courses.value.push(cloneDeep(defaultCourse.value));
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

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