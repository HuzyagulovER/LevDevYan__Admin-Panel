<template>
	<div class="days">
		<div class="days__container">
			<div class="days__empty empty" v-if="isEmpty">
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
				<CoursesCreateEditDay
					class="days__day"
					v-for="(j, i) in Object.keys(data).reverse()"
					:key="j"
					:day="data[j]"
					:number="Object.keys(data).length - i"
					@delete-day="deleteDay(j)"
				/>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconImage from "@icons/IconImage.vue";
import CoursesCreateEditDay from "@for-course-create/CoursesCreateEditDay.vue";
import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { computed, inject } from "@vue/runtime-core";
import { StoreGeneric } from "pinia";
import { CourseDays } from "../../../helpers";

const props = defineProps<{ data: CourseDays }>();

const store = <StoreGeneric>inject("Store");
const clearVariable = <Function>inject("clearVariable");

let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);
let isEmpty: ComputedRef<boolean> = computed(
	() => !Object.keys(props.data).length || props.data === null
);

function deleteDay(index: string | number): void {
	delete props.data[index];
}
</script>

<style lang="scss" scoped>
.days {
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