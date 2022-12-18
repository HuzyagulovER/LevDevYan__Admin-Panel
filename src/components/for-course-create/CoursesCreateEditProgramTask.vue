<template>
	<div class="task">
		<div class="task__container">
			<div class="task__line">
				<p class="task__header">Задание {{ number + 1 }}</p>
				<IconTrash class="task__icon" @click="confirmDeletingActive" />
			</div>

			<form class="task__form form">
				<label class="form__label" for="task-title">
					<p>Название:</p>
					<input
						type="text"
						id="task-title"
						name="title"
						class="form__input"
						v-model="task.title"
					/>
				</label>
				<label class="form__label" for="task-type">
					<p>Тип:</p>
					<input
						type="text"
						id="task-type"
						name="type"
						class="form__input"
						v-model="task.type"
					/>
				</label>
				<label class="form__label" for="task-description">
					<p>Описание:</p>
					<textarea
						type="text"
						id="task-description"
						name="description"
						class="form__textarea"
						v-model="task.description"
					></textarea>
				</label>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import Popup from "@add-comps/Popup.vue";
import { CourseProgramTask } from "../../../helpers";
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { StoreGeneric } from "pinia";

const props = defineProps<{ task: CourseProgramTask; number: number }>();
const emit = defineEmits(["deleteTask"]);
const store = <StoreGeneric>inject("Store");

let popup: Ref<boolean> = ref(false);
let deleteIndex: Ref<number> = ref(0);

async function confirmDeletingActive() {
	deleteIndex.value = props.number;
	await store.callPopup("Удалить это задание?").then((r: boolean) => {
		if (r) {
			emit("deleteTask", deleteIndex.value);
			deleteIndex.value = 0;
		}
	});
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

.task {
	background-color: var(--c__light-blue);
	border-radius: 0.65rem;
	padding: 1.4rem 2rem;

	& + & {
		margin-top: 2rem;
	}

	&__container {
		display: flex;
		flex-direction: column;
	}

	&__line {
		display: flex;
		align-items: center;
		height: 1.5rem;
		margin-bottom: 1.2rem;
	}

	&__header {
		font: {
			family: var(--f__mazzard-sb);
			size: 1.6rem;
		}
	}

	&__icon {
		fill: var(--c__red);
		height: 100%;
		margin-left: auto;
		cursor: pointer;
		width: auto;
	}

	.form {
		&__label {
			display: flex;

			p {
				font-size: 1.5rem;
				line-height: 1.5rem;
				flex: 1;
				margin-top: 0.3rem;
			}

			& + .form__label {
				margin-top: 0.8rem;
			}
		}

		&__input,
		&__textarea {
			flex: 10;
			font-size: 1.5rem;
			line-height: 1.5rem;
			background-color: rgba($color: #000000, $alpha: 0);
			border: 0.1rem solid var(--c__grey);
			border-radius: 0.6rem;
			padding: 0 1rem;
		}

		&__input {
			height: 2.5rem;
		}

		&__textarea {
			resize: none;
			padding: 0.3rem 1rem;
			max-height: 15rem;
			min-height: 8.5rem;
		}

		&__input:focus,
		&__textarea:focus {
			background-color: var(--c__white);
		}

		&__textarea:focus {
			resize: vertical;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		&__line {
			height: 1.8rem;
		}

		&__header {
			font: {
				size: 2rem;
			}
		}

		.form {
			&__label {
				flex-direction: column;

				p {
					font-size: 1.7rem;
					line-height: 1.7rem;
					margin-bottom: 0.4rem;
				}

				& + .form__label {
					margin-top: 1.2rem;
				}
			}

			&__input,
			&__textarea {
				flex: unset;
				height: auto;
				font-size: 1.7rem;
				line-height: 1.7rem;
				padding: 0.5rem 1rem;
			}

			&__textarea {
				max-height: 20rem;
				min-height: 15rem;
			}
		}
	}
}
</style>