<template>
	<div class="programs">
		<div class="programs__container">
			<TransitionGroup tag="div" name="list">
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
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { StoreGeneric } from "pinia";
import { CourseProgram } from "../../../helpers";

const props = defineProps<{ data: Array<CourseProgram> }>();

const store = <StoreGeneric>inject("Store");
const clearVariable: any = inject("clearVariable");

let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);

function deleteDay(index: number): void {
	props.data.splice(index, 1);
}
</script>

<style lang="scss" scoped>
</style>