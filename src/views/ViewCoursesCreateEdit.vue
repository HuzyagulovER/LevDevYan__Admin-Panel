<template>
	<section class="courses-create-edit">
		<div class="courses-create-edit__top-line top-line">
			<RouterLink
				class="top-line__link-about"
				:to="`/courses/create-edit/${route.params.courseId}/about`"
				:class="{ js_active: route.path.includes('about') }"
			>
				О курсе
			</RouterLink>
			<RouterLink
				class="top-line__link-days"
				:class="{ js_active: route.path.includes('days') }"
				:to="`/courses/create-edit/${route.params.courseId}/days`"
			>
				Программа курса
			</RouterLink>
			<ButtonCreate
				create_name="Добавить день"
				class="top-line__button-create"
				v-if="route.path.includes('days')"
				@click="createNewDay"
			/>
			<LanguageChoice
				:isCookie="false"
				:defaultLang="activeData.lang"
				@return-lang="changeLang"
				v-else
				class="top-line__lang-choice"
			/>
		</div>
		<div class="courses-create-edit__container">
			<RouterView v-slot="{ Component }">
				<KeepAlive>
					<Component
						:is="Component"
						:data="activeData"
						:courseId="route.params.courseId"
						:current-error="currentError"
						:disabled-form="disabledForm"
						@save-course="saveCourse"
						@update-course="updateCourse"
					/>
				</KeepAlive>
			</RouterView>
		</div>
	</section>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import TheLoader from "@add-comps/TheLoader.vue";
import LanguageChoice from "@add-comps/LanguageChoice.vue";
import { useRoute, useRouter } from "vue-router";
import {
	computed,
	ComputedRef,
	inject,
	onMounted,
	onUnmounted,
	ref,
	Ref,
	watch,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	Course,
	Courses,
	CourseAbout,
	CourseDays,
	ReturnedData,
	ReturnedError,
} from "../../helpers";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
let clearVariable = <Function>inject("clearVariable");
let getSHA256Hash = <Function>inject("getSHA256Hash");
const {
	courses,
	defaultCourse,
	defaultDayItem,
	loading,
	mainTitle,
	languages,
} = storeToRefs(store);
const route = useRoute();
const router = useRouter();

let disabledForm: Ref<boolean> = ref(false);
let isOpenedPage: boolean = <boolean>router.options.history.state.replaced;
const activeCourse: Ref<Course> = ref({
	...cloneDeep(defaultCourse.value),
});
const page: ComputedRef<string> = computed(() => {
	return route.path.split("/")[route.path.split("/").length - 1];
});
let currentError: Ref<string> = ref("");

if (route.params.courseId === "new") {
	mainTitle.value = "Создание курса";
	onMounted(() => {
		changeLang(Object.keys(languages.value)[0]);
	});
} else {
	store.getCourse(route.params.courseId).then((r: Courses | Array<null>) => {
		if (Array.isArray(r)) {
			router.replace({ path: "/courses" });
		}
		mainTitle.value = "Редактирование курса";

		activeCourse.value = cloneDeep(
			(r as { [key: string]: Course })[route.params.courseId as string]
		);
	});
}

const activeData: ComputedRef<CourseAbout | CourseDays> = computed(
	(): CourseAbout | CourseDays => {
		return activeCourse.value[page.value as keyof Course];
	}
);

loading.value = false;

onUnmounted(() => {
	mainTitle.value = "";
});

watch(
	() => currentError,
	(): void => {
		if (currentError.value === "") disabledForm.value = false;
	}
);

function saveCourse(): void {
	disabledForm.value = true;
	loading.value = true;
	store
		.addCourse(activeCourse.value)
		.then((r: ReturnedData | ReturnedError) => {
			loading.value = false;
			if (r.success) {
				router.push({ path: "/courses" });
			} else {
				currentError.value = r.error.status;
				setTimeout(() => {
					currentError.value = "";
				}, 2000);
			}
		});
	disabledForm.value = false;
}

function updateCourse(): void {
	disabledForm.value = true;
	loading.value = true;

	store
		.updateCourse(activeCourse.value)
		.then((r: ReturnedData | ReturnedError) => {
			loading.value = false;
			if (r.success) {
				router.push({ path: "/courses" });
			} else {
				currentError.value = r.error.status;
				setTimeout(() => {
					currentError.value = "";
				}, 2000);
			}
		});
	disabledForm.value = false;
}

async function createNewDay(): Promise<void> {
	let hash: string = await getSHA256Hash(Date.now());
	(activeCourse.value.days as CourseDays)[hash] = cloneDeep(
		defaultDayItem.value
	);
	// (activeCourse.value.days as CourseDays).push(cloneDeep(defaultDayItem.value));
}

function changeLang(lang: string) {
	activeData.value.lang = lang;
}
</script>

<style scoped lang="scss">
@import "../style.scss";

.courses-create-edit {
	flex: 1;
	display: flex;
	flex-direction: column;

	&__container {
		flex: 1;
	}

	.top-line {
		display: flex;
		margin-bottom: 2rem;

		&__link-about,
		&__link-days {
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

		&__link-about {
			padding: 0.7rem 3.5rem;
			margin-right: 2rem;
		}

		&__link-days {
			padding: 0.7rem 3rem;
		}

		&__button-create {
			margin-left: auto;
		}

		&__lang-choice {
			margin-left: auto;
			margin-bottom: 0;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.top-line {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 2.5rem;

			&__link-about,
			&__link-days {
				font-size: 1.9rem;
				text-align: center;
				padding: 1rem 3rem;
			}

			&__link-about {
				flex: 1;
			}

			&__link-days {
				flex: 2;
			}

			.button-create {
				display: flex;
				justify-content: center;
				padding: 1.4rem 3rem;
				margin: 1rem auto 0;
				width: 100%;
				font-size: 2rem;
			}
		}
	}
}
</style>