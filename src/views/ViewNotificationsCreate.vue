<template>
	<section class="notification-create">
		<form
			class="notification-create__form form"
			@submit.prevent="addNotification($event)"
		>
			<div
				class="form__file-input file-input"
				:class="{ _error: isLargeImage }"
			>
				<div class="file-input__image" v-if="image">
					<img :src="image" alt="" />
				</div>
				<div class="file-input__container" v-else>
					<IconImage />
					<p v-if="isLargeImage">
						Изображение должно быть
						<br />не больше {{ maxFileSizeText }}
					</p>
					<p v-else>
						Загрузить<br />
						изображение
					</p>
				</div>

				<input
					id="input_image"
					type="file"
					accept="image/*"
					name="notification_image"
					:disabled="disabledForm"
					@change="displayImage($event)"
				/>
			</div>

			<label for="input_lang" class="form__label">Язык</label>
			<div class="form__input" :class="{ _error: error.includes('lang') }">
				<select
					id="input_lang"
					name="lang"
					v-model="newNotification.lang"
					:disabled="disabledForm"
				>
					<option value="ru">Русский</option>
					<option value="eng">Английский</option>
					<option value="any">Любой</option>
				</select>
			</div>

			<label for="input_title" class="form__label">Заголовок</label>
			<input
				id="input_title"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('title') }"
				name="title"
				:disabled="disabledForm"
				v-model="newNotification.title"
				@input="error = clearVariable(error)"
			/>

			<label for="input_type" class="form__label">Тип</label>
			<!-- <input
				id="input_type"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('text') }"
				name="type"
				:disabled="disabledForm"
				v-model="newNotification.type"
				@input="error = clearVariable(error)"
			/> -->

			<div class="form__input" :class="{ _error: error.includes('type') }">
				<select
					id="input_type"
					name="type"
					v-model="newNotification.type"
					:disabled="disabledForm"
				>
					<option value="notification">Нотификация</option>
					<option value="in_app">В приложении</option>
				</select>
			</div>

			<label for="input_body" class="form__label">Текст</label>
			<input
				id="input_body"
				type="text"
				name="body"
				class="form__input"
				:class="{ _error: error.includes('body') }"
				:disabled="disabledForm"
				v-model="newNotification.body"
				@input="error = clearVariable(error)"
			/>

			<label for="input_time" class="form__label">Время</label>
			<input
				id="input_time"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('time') }"
				name="time"
				:disabled="disabledForm"
				v-model="newNotification.time"
				@input="error = clearVariable(error)"
			/>

			<label for="input_date" class="form__label">Дата</label>
			<input
				id="input_date"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('date') }"
				name="date"
				:disabled="disabledForm"
				v-model="newNotification.date"
				@input="error = clearVariable(error)"
			/>

			<label for="input_app" class="form__label">Приложение</label>
			<div class="form__input" :class="{ _error: error.includes('app') }">
				<select
					id="input_app"
					name="app"
					v-model="newNotification.app"
					:disabled="disabledForm"
				>
					<option value="psy">PSY</option>
					<option value="avocado">Avocado</option>
					<option value="-psy">Не PSY</option>
					<option value="-avocado">Не Avocado</option>
				</select>
			</div>

			<ButtonGreen type="submit" :disabled="disabledForm">
				Сохранить уведомление
			</ButtonGreen>
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
const isLargeFile: any = inject("isLargeFile");
const maxFileSizeText: any = inject("maxFileSizeText");

const newNotification: Ref<Notification> = ref({
	lang: "",
	type: "",
	title: "",
	body: "",
	date: "",
	time: "",
	app: "",
});
let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);
let image: Ref<string> = ref("");
let isLargeImage: Ref<boolean> = ref(false);

function displayImage(e: Event): void {
	if (isLargeFile(e)) {
		(e as any).currentTarget.value = null;
		isLargeImage.value = true;
		setTimeout(() => {
			isLargeImage.value = false;
		}, 2000);
	}
	image.value = (e as any).currentTarget.files.length
		? URL.createObjectURL((e as any).currentTarget.files[0])
		: "";
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
		$file-input-error-color: #ff4545;
		.file-input {
			aspect-ratio: 47/20;
			background-color: rgba($color: $file-input-color, $alpha: 0.23);
			border: 0.2rem solid $file-input-color;
			border-radius: 1rem;
			position: relative;
			display: flex;
			justify-content: center;
			max-height: 190px;
			box-sizing: content-box;

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

			&._error {
				background-color: rgba($color: $file-input-error-color, $alpha: 0.23);
				border: 0.2rem solid $file-input-error-color;

				p {
					color: $file-input-error-color;
				}

				svg {
					fill: $file-input-error-color;
				}
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

			select {
				border: 0;
				width: 100%;
				height: 100%;
				font-size: inherit;
				background-color: transparent;
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
				min-height: 18rem;

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

			&__input + label {
				margin-top: 1.5rem !important;
			}

			button {
				margin-top: 2rem;
			}
		}
	}
}
</style>