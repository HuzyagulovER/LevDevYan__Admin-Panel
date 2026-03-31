<template>
	<section class="courses">
		<CoursesSearch class="courses__search" />
		<LanguageChoice @return-lang="changeLang" :isCookie="true" />
		<div class="courses__empty" v-if="isEmpty && !loading">
			<img src="@images/Courses__Empty-Courses.png" alt="" width="281" height="255" />
			<p>Курсов еще нет...</p>
		</div>
		<TransitionGroup tag="div" name="list" v-else>
      <CoursesCourseItem v-for="course in courses"
                         :key="course.id"
                         :courseId="course.id"
                         @confirm-deleting-active="confirmDeletingActive"
                         @change-course-production="changeCourseProduction"
                         :category="course.category"
                         :duration-days="course.duration_days"
                         :image="course.image"
                         :price="course.price"
                         :title="course.title"
                         :is_in_production="course.is_in_production"
                         :active_count="course.active_count"
      />
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
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
import {CoursesPreview} from "../../helpers";

const store = <StoreGeneric>inject("Store");
const clearVariable = <Function>inject("clearVariable");
const { loading, languages } = storeToRefs(store);
const route = useRoute();
const { cookies } = useCookies();

let courses: Ref<CoursesPreview> = ref({});
let isEmpty: ComputedRef<boolean> = computed(
	() => !Object.keys(courses.value).length
);
let popup: Ref<boolean> = ref(false);
let pageName: Ref = toRef(route, "name");
let lang = cookies.get(`${pageName.value}Lang`);

const language = function (): string {
	return !lang || !languages.value[lang]
		? Object.keys(languages.value)[0]
		: cookies.get(`${pageName.value}Lang`);
};

getCourses(language());

async function getCourses(language: string): Promise<void> {
  loading.value = true

  await store.getCourses(language)
      .then(async (r: CoursesPreview) => {
        courses.value = r
      })
      .finally(() => loading.value = false)
}

async function confirmDeletingActive(courseId: string): Promise<void> {
  await store.callPopup("Удалить этот курс?")
      .then((r: boolean) => {
        if (r) {
          store.deleteCourse(courseId)
              .then(async () => {
                await getCourses(language());
              });
        }
      });
}

async function changeLang(language: string) {
  loading.value = true

  await getCourses(language);
}

async function changeCourseProduction(courseId: string, state: boolean) {
  loading.value = true;
  await store.updateCourseProduction(courseId, state)
      .then(() => {
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