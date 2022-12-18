<template>
	<div class="programs">
		<div class="programs__container">
			<div class="programs__empty empty" v-if="isEmpty">
				<div class="empty__wrapper">
					<img
						src="@images/Courses__Empty_Days_Guy.png"
						alt=""
						width="162"
						height="213"
					/>
					<img
						src="@images/Courses__Empty_Days_Girl.png"
						alt=""
						width="160"
						height="209"
					/>
				</div>
				<p>Программа курса еще пуста...</p>
			</div>
			<TransitionGroup tag="div" name="list" v-else>
				<CoursesCreateEditProgramItem
					class="programs__program"
					v-for="(program, i) in data"
					:key="program?.id || program"
					:program="program"
					:number="i"
					@delete-day="deleteDay"
				/>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconImage from "@icons/IconImage.vue";
import CoursesCreateEditProgramItem from "@for-course-create/CoursesCreateEditProgramItem.vue";
import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { computed, inject } from "@vue/runtime-core";
import { StoreGeneric } from "pinia";
import { CourseProgram } from "../../../helpers";

const props = defineProps<{ data: Array<CourseProgram> }>();

const store = <StoreGeneric>inject("Store");
const clearVariable: any = inject("clearVariable");

let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);
let isEmpty: ComputedRef<boolean> = computed(() => !props.data.length);

function deleteDay(index: number): void {
	props.data.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.programs {
	height: 100%;

	&__container {
		height: 100%;
	}

	.empty {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		&__wrapper {
			margin-bottom: 2rem;
			img {
				width: 9rem;
				height: auto;
			}
		}

		p {
			font-size: 1.5rem;
		}
	}
}
</style>