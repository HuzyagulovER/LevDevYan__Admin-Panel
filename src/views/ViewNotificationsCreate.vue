<template>
	<section class="notification-create">
		<form
			class="notification-create__form form"
			@submit.prevent="addNotification($event)"
		>
			<div class="form__file-input file-input">
				<div class="file-input__image" v-if="image">
					<img :src="image" alt="" />
				</div>
				<div class="file-input__container" v-else>
					<IconImage />
					<p>
						Загрузить<br />
						изображение
					</p>
				</div>

				<input
					id="image"
					type="file"
					accept="image/*"
					name="image"
					:disabled="disabledForm"
					@change="displayImage($event)"
				/>
			</div>

			<label for="promocode" class="form__label">Заголовок</label>
			<input
				id="title"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('title') }"
				name="title"
				:disabled="disabledForm"
				v-model="newNotification.title"
				@input="error = clearVariable(error)"
			/>

			<label for="promocode" class="form__label">Тип</label>
			<input
				id="type"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('text') }"
				name="type"
				:disabled="disabledForm"
				v-model="newNotification.type"
				@input="error = clearVariable(error)"
			/>

			<label for="promocode" class="form__label">Текст</label>
			<input
				id="text"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('text') }"
				name="text"
				:disabled="disabledForm"
				v-model="newNotification.text"
				@input="error = clearVariable(error)"
			/>

			<label for="promocode" class="form__label">Время</label>
			<input
				id="time"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('time') }"
				name="time"
				:disabled="disabledForm"
				v-model="newNotification.time"
				@input="error = clearVariable(error)"
			/>

			<label for="promocode" class="form__label">Дата</label>
			<input
				id="date"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('date') }"
				name="date"
				:disabled="disabledForm"
				v-model="newNotification.date"
				@input="error = clearVariable(error)"
			/>

			<label for="promocode" class="form__label">Приложение</label>
			<input
				id="application"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('application') }"
				name="application"
				:disabled="disabledForm"
				v-model="newNotification.application"
				@input="error = clearVariable(error)"
			/>

			<ButtonGreen type="submit" :disabled="disabledForm"
				>Отправка уведомления</ButtonGreen
			>
		</form>
	</section>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Notification } from "../../helpers";
import ButtonGreen from "@add-comps/ButtonGreen.vue";
import IconImage from "@icons/IconImage.vue";
import router from "../routes";

const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);
const clearVariable: any = inject("clearVariable");

const newNotification: Ref<Notification> = ref({
	title: "",
	type: "",
	text: "",
	time: "",
	date: "",
	application: "",
});
let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);
const formData: FormData = new FormData();
let image: Ref<string> = ref("");

function displayImage(e: Event) {
	image.value = URL.createObjectURL((e as any).target.files[0]);
	console.log(image.value);
}

function addNotification(e: Event) {
	disabledForm.value = true;
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	for (let key in newNotification.value) {
		if (newNotification.value[key as keyof Notification] === "")
			error.value.push(key);
	}

	if (error.value.length) {
		disabledForm.value = false;
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}
	loading.value = true;

	store.addNotification(fd).then(() => {
		disabledForm.value = false;
		loading.value = false;
		newNotification.value = clearVariable(newNotification.value);
		router.push({ name: "Notifications" });
	});
}
</script>

<style scoped lang="scss">
@import "../style.scss";

.notification-create {
	.form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: 450px;
		width: 100%;

		&__label,
		&__file-input,
		&__input {
			width: 100%;
		}

		$file-input-color: #dbd4ff;
		.file-input {
			aspect-ratio: 47/20;
			background-color: rgba($color: $file-input-color, $alpha: 0.23);
			border: 0.2rem solid $file-input-color;
			border-radius: 1rem;
			position: relative;
			display: flex;
			justify-content: center;
			max-height: 190px;

			&__container {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
			}

			&__image {
				width: 100%;
				height: 100%;
				padding: 1rem;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}

			svg {
				width: 2rem;
				height: 2rem;
				fill: #7b61ff;
				margin-bottom: 0.5rem;
			}

			p {
				text-align: center;
				color: #7b61ff;
				line-height: 1.5rem;
				font: {
					size: 1.5rem;
					family: var(--f__mazzard-sb);
				}
			}

			input {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				cursor: pointer;
				opacity: 0;
			}
		}

		&__label {
			margin-bottom: 0.5rem;
			font: {
				family: "Mazzard SemiBold";
				size: 1.6rem;
			}
		}

		&__file-input,
		&__input {
			margin-bottom: 1.2rem;
		}

		&__input {
			border: 0.1rem solid var(--c__grey);
			border-radius: 0.6rem;
			font: {
				size: 1.25rem;
			}
			height: 2.5rem;
			padding: 0 1rem;

			&._error {
				border-color: red;
			}
		}

		&__button {
			background-color: #31ac71;
			border: 0;
			color: var(--c__white);
			font-size: 1.6rem;
			height: 3.5rem;
			padding: 0 5rem;
			border-radius: 1rem;
			margin-top: 1rem;
			cursor: pointer;

			&.disabled {
				background-color: var(--c__grey);
				cursor: auto;
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.form {
			max-width: unset;

			.file-input {
				border-width: 0.3rem;
				height: 18rem;

				svg {
					width: 2.6rem;
					height: 2.6rem;
				}

				p {
					font: {
						size: 1.7rem;
					}
				}
			}

			&__label {
				font: {
					size: 2rem;
				}
			}

			&__input {
				font: {
					size: 1.7rem;
				}
				padding: 0.5rem 1.2rem;
				height: unset;
				margin: 0;

				&._error {
					border-color: red;
				}
			}

			input + label {
				margin-top: 1.5rem !important;
			}

			button {
				margin-top: 2rem;
			}
		}
	}
}
</style>