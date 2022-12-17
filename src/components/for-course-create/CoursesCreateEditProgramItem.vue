<template>
	<div class="program">
		<div class="program__container">
			<div class="program__line">
				<p class="program__title">День {{ number + 1 }}</p>
				<IconTrash class="program__icon" @click="confirmDeletingActive" />
			</div>
			<input
				type="text"
				class="program__input"
				name="title"
				v-model="program.title"
				placeholder="Название"
			/>
			<label for="description">Описание</label>
			<textarea
				type="text"
				class="program__textarea"
				name="description"
				v-model="program.description"
				placeholder="Описание дня"
			>
			</textarea>
			<div class="program__line" :class="{ opened: opened }">
				<ButtonGreen class="program__button" @click="addTask($event)">
					<span>+</span> Добавить задание
				</ButtonGreen>
				<div>
					<p>Задания ({{ tasksNumber }})</p>
					<IconCorner class="program__corner" @click="toggleTasks" />
				</div>
			</div>
			<div
				class="progran__tasks tasks"
				ref="tasks"
				:class="{ open: container_open }"
			>
				<div class="tasks__container">
					<div class="tasks__empty empty" v-if="emptyTasks">
						<img
							src="@images/Courses__Edit_Empty-Tasks.png"
							alt=""
							width="118"
							height="123"
							class="empty__image"
						/>
						<p class="empty__text">Заданий еще нет...</p>
					</div>
					<TransitionGroup tag="div" name="list" v-else>
						<CoursesCreateEditProgramTask
							v-for="(task, i) in program.tasks"
							:key="task"
							:task="task"
							:number="i"
							@delete-task="deleteTask"
						/>
					</TransitionGroup>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ButtonGreen from "@add-comps/ButtonGreen.vue";
import IconTrash from "@icons/IconTrash.vue";
import IconCorner from "@icons/IconCorner.vue";
import CoursesCreateEditProgramTask from "@for-course-create/CoursesCreateEditProgramTask.vue";
import Popup from "@add-comps/Popup.vue";
import { CourseProgram, CourseProgramTask } from "../../../helpers";
import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { StoreGeneric, storeToRefs } from "pinia";
import { computed, inject, watch } from "@vue/runtime-core";
import { cloneDeep } from "lodash";

const props = defineProps<{ program: CourseProgram; number: number }>();
const emit = defineEmits(["deleteDay"]);

const store = <StoreGeneric>inject("Store");
const { defaultTaskItem } = storeToRefs(store);

const tasks: any = ref(null);
let opened: Ref<boolean> = ref(false);
let container_open: Ref<boolean> = ref(false);

let tasksNumber: ComputedRef<number> = computed(() => {
	return props.program.tasks.length;
});

let popup: Ref<boolean> = ref(false);
let deleteIndex: Ref<number> = ref(0);

watch(
	() => opened.value,
	() => {
		if (!tasks.value?.classList.contains("open")) {
			tasks.value.style.height = tasks.value.scrollHeight + "px";
			setTimeout(() => {
				tasks.value.style = "";
				container_open.value = true;
			}, 300);
		} else {
			tasks.value.style.height = tasks.value.scrollHeight + "px";
			container_open.value = false;
			setTimeout(() => {
				tasks.value.style = "";
			}, 0);
		}
	}
);

let emptyTasks: ComputedRef<boolean> = computed(() => {
	return props.program.tasks.length === 0 ? true : false;
});

function toggleTasks(): void {
	opened.value = !opened.value;
}

function getEmptiesFromLastTask(): number {
	const lastTask = props.program.tasks[props.program.tasks.length - 1];
	let empties = 0;
	for (const key in lastTask) {
		if (lastTask[key as keyof CourseProgramTask] === "") empties++;
	}
	return empties;
}

function addTask(e: Event): void {
	const taskPropsNumber: number = Object.keys(
		defaultTaskItem.value as {}
	).length;

	if (taskPropsNumber > getEmptiesFromLastTask()) {
		props.program.tasks.push(cloneDeep(defaultTaskItem.value));
		if (!opened.value) toggleTasks();
		setTimeout(() => {
			const tasks = (e.target as any)
				.closest(".program")
				.querySelectorAll(".task");
			const lastTask: HTMLElement = tasks[tasks.length - 1];
			const inputs: NodeList = lastTask.querySelectorAll("input,textarea");
			setTimeout(() => {
				(inputs[0] as HTMLElement).focus();
			}, 500);
		}, 0);
	}
}

function deleteTask(index: number): void {
	props.program.tasks.splice(index, 1);
}

async function confirmDeletingActive() {
	deleteIndex.value = props.number;
	await store.callPopup("Удалить этот день?").then((r: boolean) => {
		if (r) {
			emit("deleteDay", props.number);
			deleteIndex.value = 0;
		}
	});
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

.program {
	padding: 2rem 3rem;
	border-radius: 1.4rem;
	box-shadow: 0 0 1rem 0 rgba($color: #000000, $alpha: 0.13);

	& + & {
		margin-top: 3rem;
	}

	&__container {
		display: flex;
		flex-direction: column;
	}

	&__line {
		display: flex;
		align-items: center;
		margin-bottom: 1.5rem;

		svg {
			height: 2.3rem;
			width: 2.3rem;
		}

		&.opened {
			.program__corner {
				transform: rotate(0);
			}
		}

		div {
			display: flex;
			align-items: center;
			font-size: 1.5rem;

			p {
				margin-right: 1rem;
			}
		}
	}

	label {
		margin-bottom: 0.5rem;
		font: {
			family: var(--f__mazzard-sb);
			size: 1.9rem;
		}
	}

	&__title {
		font: {
			family: var(--f__mazzard-sb);
			size: 1.9rem;
		}
	}

	&__input,
	&__textarea {
		border: 0.1rem solid var(--c__grey);
		border-radius: 0.6rem;
		margin-bottom: 1.5rem;
		font: {
			size: 1.5rem;
		}
		height: 3rem;
		padding: 0 1rem;

		&._error {
			border-color: red;
		}
	}

	&__textarea {
		resize: vertical;
		min-height: 8rem;
		max-height: 15rem;
		padding: 0.5rem 1rem;
	}

	&__icon {
		margin-left: auto;
		cursor: pointer;
		fill: var(--c__red);
	}

	&__button {
		align-self: flex-start;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
		border-radius: 0.6rem;
		margin-right: auto;

		span {
			font-size: 1.8rem;
			margin-right: 0.5rem;
		}
	}

	&__corner {
		width: 2rem !important;
		height: auto !important;
		fill: var(--c__violet);
		transform: rotate(180deg);
		transition: var(--transition-03), opacity 0.3s ease, visibility 0s;
		opacity: 1;
		visibility: visible;
		cursor: pointer;
	}

	.tasks {
		height: 0;
		overflow: hidden;
		transition: var(--transition-03);

		&.open {
			height: auto;
		}
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		img {
			margin-bottom: 1rem;
			width: 8.4rem;
			height: 8.8rem;
			object-fit: cover;
		}

		p {
			font-size: 1.5rem;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		&__title {
			font: {
				size: 2.3rem;
			}
		}

		&__input,
		&__textarea {
			font: {
				size: 1.7rem;
			}
			height: auto;
			padding: 0.8rem 1rem;
		}

		label {
			font: {
				size: 2.1rem;
			}
		}
	}
}
</style>