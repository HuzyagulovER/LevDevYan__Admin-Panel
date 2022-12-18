<template>
	<section class="courses-create-edit">
		<div class="courses-create-edit__top-line top-line">
			<RouterLink
				class="top-line__link-about"
				:to="`/courses/create-edit/${route.params.id}/about`"
				:class="{ js_active: route.path.includes('about') }"
			>
				О курсе
			</RouterLink>
			<RouterLink
				class="top-line__link-program"
				:class="{ js_active: route.path.includes('program') }"
				:to="`/courses/create-edit/${route.params.id}/program`"
			>
				Программа курса
			</RouterLink>
			<ButtonCreate
				create_name="Добавить день"
				class="top-line__button-create"
				v-if="route.path.includes('program')"
				@click="createNewDay"
			/>
		</div>
		<div class="courses-create-edit__container">
			<RouterView v-slot="{ Component }">
				<KeepAlive>
					<Component
						:is="Component"
						:data="activeData"
						@save-course="saveCourse"
					/>
				</KeepAlive>
			</RouterView>
		</div>
	</section>
</template>

<script setup lang="ts">
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import TheLoader from "@add-comps/TheLoader.vue";
import { useRoute, useRouter } from "vue-router";
import {
	computed,
	ComputedRef,
	inject,
	onUnmounted,
	ref,
	Ref,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Course, Courses, CourseAbout, CourseProgram } from "../../helpers";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
let clearVariable: any = inject("clearVariable");
const { courses, defaultCourse, defaultProgramItem, loading, mainTitle } =
	storeToRefs(store);
const route = useRoute();
const router = useRouter();

loading.value = true;

let disabledForm: Ref<boolean> = ref(false);
let isOpenedPage: boolean = <boolean>router.options.history.state.replaced;
const activeCourse: Ref<Course> = ref({
	...cloneDeep(defaultCourse.value),
});
const potentialCourse = courses.value[route.params.id as keyof Courses];
const page: ComputedRef<string> = computed(() => {
	return route.path.split("/")[route.path.split("/").length - 1];
});

if (isOpenedPage) {
	store.getCourses().then(() => {
		if (!courses.value[route.params.id as keyof Courses]) {
			mainTitle.value = "Создание курса";
			router.replace({ path: "/courses" });
		} else {
			mainTitle.value = "Редактирование курса";
			activeCourse.value = cloneDeep(
				courses.value[route.params.id as keyof Courses]
			);
		}
	});
} else {
	if (!potentialCourse) {
		mainTitle.value = "Создание курса";
		activeCourse.value = cloneDeep(defaultCourse.value);
	} else {
		mainTitle.value = "Редактирование курса";
		activeCourse.value = cloneDeep(potentialCourse);
	}
}

const activeData: any = computed(() => {
	return activeCourse.value[page.value as keyof Course];
});

loading.value = false;

onUnmounted(() => {
	mainTitle.value = "";
});

function saveCourse(): void {
	disabledForm.value = true;
	loading.value = true;
	store.saveCourse(activeCourse.value).then(() => {
		loading.value = false;
		router.push({ path: "/courses" });
	});
	courses.value[route.params.id as keyof Courses] = cloneDeep(
		activeCourse.value
	);
	disabledForm.value = false;
}

function createNewDay(): void {
	(activeCourse.value.program as Array<CourseProgram>).push(
		cloneDeep(defaultProgramItem.value)
	);
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
		&__link-program {
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

		&__link-program {
			padding: 0.7rem 3rem;
		}

		&__button-create {
			margin-left: auto;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.top-line {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 3.5rem;

			&__link-about,
			&__link-program {
				font-size: 1.9rem;
				text-align: center;
				padding: 1rem 3rem;
			}

			&__link-about {
				flex: 1;
			}

			&__link-program {
				flex: 2;
			}

			.button-create {
				display: flex;
				justify-content: center;
				padding: 1.5rem 3rem;
				margin: 1rem auto 0;
				width: 100%;
				font-size: 2rem;
			}
		}
	}
}
</style>