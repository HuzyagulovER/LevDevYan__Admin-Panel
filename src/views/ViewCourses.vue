<template>
	<section class="courses">
		<CoursesSearch class="courses__search" />
		<LanguageChoice @return-lang="changeLang" :isCookie="true" />
		<div class="courses__empty" v-if="isEmpty && !loading">
			<img src="@images/Courses__Empty-Courses.png" alt="" width="281" height="255" />
			<p>Курсов еще нет...</p>
		</div>
		<TransitionGroup tag="div" name="list" v-else>
			<CoursesCourseItem v-for="course in courses" :key="course.course_id" :courseId="course.course_id"
				:about="course.about" :production="course.production" :active="course.active"
				@confirm-deleting-active="confirmDeletingActive" @change-course-production="changeCourseProduction" />
		</TransitionGroup>
	</section>
</template>

<script setup lang="ts">
import CoursesCourseItem from "@for-courses/CoursesCourseItem.vue";
import CoursesSearch from "@for-courses/CoursesSearch.vue";
import LanguageChoice from "@add-comps/LanguageChoice.vue";
import {
	computed,
	ComputedRef,
	inject,
	ref,
	Ref,
	toRef,
	watch,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";

const store = <StoreGeneric>inject("Store");
const clearVariable = <Function>inject("clearVariable");
const { courses, loading, languages } = storeToRefs(store);
const route = useRoute();
const { cookies } = useCookies();

let isEmpty: ComputedRef<boolean> = computed(
	() => !Object.keys(courses.value).length
);
let popup: Ref<boolean> = ref(false);
let deleteIndex: Ref<number> = ref(0);
let pageName: Ref = toRef(route, "name");
let lang = cookies.get(`${pageName.value}Lang`);

const language = function (): string {
	return !lang || !languages.value[lang]
		? Object.keys(languages.value)[0]
		: cookies.get(`${pageName.value}Lang`);
};

store.getCourses(language());

async function confirmDeletingActive(index: number): Promise<void> {
	deleteIndex.value = index;
	await store.callPopup("Удалить этот курс?").then((r: boolean) => {
		if (r) {
			store.deleteCourse([deleteIndex.value]).then(() => {
				store.getCourses(language());
			});
			deleteIndex.value = 0;
		}
	});
}

function changeLang(lang: string) {
	store.getCourses(lang);
}

function changeCourseProduction(course_id: string, productionState: boolean) {
	loading.value = true;
	store.updateCourseProduction(course_id, productionState).then(() => {
		loading.value = false;
	});
}
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