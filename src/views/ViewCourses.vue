<template>
	<section class="courses">
		<CoursesSearch class="courses__search" />
		<div class="courses__empty" v-if="isEmpty && !loading">
			<img
				src="@images/Courses__Empty-Courses.png"
				alt=""
				width="281"
				height="255"
			/>
			<p>Курсов еще нет...</p>
		</div>
		<TransitionGroup tag="div" name="list" v-else>
			<CoursesCourseItem
				v-for="(course, j) in courses"
				:key="course?.id"
				:about="course.about"
				:index="j"
				@confirm-deleting-active="confirmDeletingActive"
			/>
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import CoursesCourseItem from "@for-courses/CoursesCourseItem.vue";
import CoursesSearch from "@for-courses/CoursesSearch.vue";
import Popup from "@add-comps/Popup.vue";
import TheLoader from "@add-comps/TheLoader.vue";
import {
	computed,
	ComputedRef,
	inject,
	ref,
	Ref,
	watch,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const store = <StoreGeneric>inject("Store");
const clearVariable: any = inject("clearVariable");
const { courses } = storeToRefs(store);
const route = useRoute();

const loading: Ref<boolean> = ref(true);
let isEmpty: ComputedRef<boolean> = computed(() => !courses.value.length);
let popup: Ref<boolean> = ref(false);
let deleteIndex: Ref<number> = ref(0);

store.getCourses().then(() => {
	loading.value = false;
});

async function confirmDeletingActive(index: number) {
	deleteIndex.value = index;
	await store.callPopup("Удалить этот курс?").then((r: boolean) => {
		if (r) {
			courses.value.splice(deleteIndex.value, 1);
			deleteIndex.value = 0;
		}
	});
}

watch(
	() => courses.value.length,
	() => {}
);
</script>

<style scoped lang="scss">
.courses {
	flex: 1;
	display: flex;
	flex-direction: column;

	&__empty {
		width: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		img {
			width: 20rem;
			height: auto;
			transform: translateX(10%);
		}

		p {
			font: {
				size: 1.9rem;
				weight: bold;
			}
		}
	}
}
</style>