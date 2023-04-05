<template>
	<section class="notification-create">
		<form
			class="notification-create__form form"
			@submit.prevent="addNotification($event)"
		>
			<div
				class="form__file-input file-input"
				:class="{
					_error:
						isLargeImage ||
						isInvalidExtension ||
						imageErrorStatuses.indexOf(currentError) !== -1,
				}"
			>
				<div class="file-input__image" v-if="image">
					<img :src="image" alt="" />
				</div>
				<div class="file-input__container" v-else>
					<IconImage />
					<p v-if="isLargeImage || currentError === 'FILE_SIZE_EXCEEDED'">
						Изображение должно быть
						<br />не больше {{ maxFileSizeText }}
					</p>
					<p
						v-else-if="
							isInvalidExtension || currentError === 'INVALID_FILE_EXTENSION'
						"
					>
						Изображение должно иметь
						<br />верное расширение ({{ acceptedImageExtensions.join(", ") }})
					</p>
					<p v-else>
						Загрузить<br />
						изображение
					</p>
				</div>

				<input
					id="input_image"
					type="file"
					:accept="acceptedImageExtensions.join(',')"
					name="notification_image"
					:disabled="disabledForm"
					@change="displayImage($event)"
					ref="formImage"
				/>
			</div>
			<div class="form__input-container input-container">
				<div class="input-container__wrapper">
					<label for="input_time" class="form__label">Время</label>
					<input
						id="input_time"
						type="time"
						class="form__input"
						:class="{ _error: error.includes('time') }"
						name="time"
						:disabled="disabledForm"
						v-model="newNotification.time"
						@input="error = clearVariable(error)"
					/>
				</div>
				<div class="input-container__wrapper">
					<label for="input_date" class="form__label">Дата</label>
					<input
						id="input_date"
						type="date"
						class="form__input"
						:class="{ _error: error.includes('date') }"
						name="date"
						:disabled="disabledForm || newNotification.repeat_times !== 1"
						v-model="newNotification.date"
						@input="error = clearVariable(error)"
					/>
				</div>
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

			<label for="input_repeat-times" class="form__label">
				Число повторений
				<span class="form__comment">(0 - неограниченное количество раз)</span>
			</label>
			<input
				id="input_repeat-times"
				type="number"
				name="repeat_times"
				class="form__input"
				:class="{ _error: error.includes('repeat_times') }"
				:disabled="disabledForm"
				v-model="newNotification.repeat_times"
				@input="error = clearVariable(error)"
				min="0"
			/>

			<label for="input_app" class="form__label">Приложение</label>
			<div class="select-container">
				<select
					id="input_app"
					name="app"
					class="form__input"
					:class="{ _error: error.includes('app') }"
					v-model="newNotification.app"
					:disabled="disabledForm"
				>
					<option value="psy">PSY</option>
					<option value="avocado">Avocado</option>
				</select>
			</div>

			<label for="input_premium_app" class="form__label">
				Подписки в приложении
			</label>
			<div class="select-container">
				<select
					id="input_premium_app"
					name="premium_app_type"
					class="form__input"
					:class="{ _error: error.includes('premium_app_type') }"
					v-model="newNotification.premium_app_type"
					:disabled="disabledForm"
				>
					<option
						v-for="(premiumAppType, j) in premiumAppTypes"
						:key="j"
						:value="j"
					>
						{{ premiumAppType }}
					</option>
				</select>
			</div>

			<label for="input_type" class="form__label" v-if="false">Тип</label>
			<input
				id="input_type"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('text') }"
				name="type"
				:disabled="disabledForm"
				v-model="newNotification.type"
				@input="error = clearVariable(error)"
				v-if="false"
			/>

			<div
				class="form__input"
				:class="{ _error: error.includes('type') }"
				v-if="false"
			>
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

			<label for="input_lang" class="form__label">Язык</label>
			<div class="select-container">
				<select
					id="input_lang"
					name="lang"
					class="form__input"
					:class="{ _error: error.includes('lang') }"
					v-model="newNotification.lang"
					:disabled="disabledForm"
				>
					<option v-for="(language, j) in languages" :key="j" :value="j">
						{{ language }}
					</option>
				</select>
			</div>

			<label for="input_days-without-open-app" class="form__label">
				Дней не входил в приложение
			</label>
			<input
				id="input_days-without-open-app"
				type="number"
				name="days_without_open_app"
				class="form__input"
				:class="{ _error: error.includes('days_without_open_app') }"
				:disabled="disabledForm"
				v-model="newNotification.days_without_open_app"
				@input="error = clearVariable(error)"
				min="0"
			/>

			<div v-if="newNotification.premium_app_type === 'not'">
				<label for="input_days-without-sub" class="form__label">
					Дней без подписки
				</label>
				<input
					id="input_days-without-sub"
					type="number"
					name="days_without_subscription"
					class="form__input"
					:class="{ _error: error.includes('days_without_subscription') }"
					:disabled="disabledForm"
					v-model="newNotification.days_without_subscription"
					@input="error = clearVariable(error)"
					min="0"
				/>
			</div>

			<div class="form__input-container input-container">
				<div class="input-container__wrapper">
					<ButtonColored
						type="submit"
						:disabled="disabledForm"
						class="form__button"
					></ButtonColored>
				</div>
			</div>
		</form>
	</section>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { Notification, ReturnedData, ReturnedError } from "../../helpers";
import ButtonColored from "@add-comps/ButtonColored.vue";
import IconImage from "@icons/IconImage.vue";
import router from "../routes";

const store = <StoreGeneric>inject("Store");
const {
	loading,
	premiumAppTypes,
	languages,
	acceptedImageExtensions,
	imageErrorStatuses,
} = storeToRefs(store);
const clearVariable = <Function>inject("clearVariable");
const isLargeFile: any = inject("isLargeFile");
const maxFileSizeText: any = inject("maxFileSizeText");
const isAcceptedExtension: any = inject("isAcceptedExtension");

const requiredFields: ReadonlyArray<string> = [
	"lang",
	"title",
	"body",
	"time",
	"app",
	"premium_app_type",
];

const newNotification: Ref<Notification> = ref({
	lang: "",
	// type: "",
	title: "",
	body: "",
	date: "",
	time: "",
	app: "",
	repeat_times: 0,
	premium_app_type: "",
	days_without_open_app: 0,
	days_without_subscription: 0,
});

let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);
let image: Ref<string> = ref("");
let isLargeImage: Ref<boolean> = ref(false);
let isInvalidExtension: Ref<boolean> = ref(false);
let currentError: Ref<string> = ref("");
let formImage: Ref = ref();

watch(
	() => currentError.value,
	(): void => {
		if (currentError.value !== "") {
			formImage.value = null;
			image.value = "";
		}
	}
);

function displayImage(e: Event): void {
	if (isLargeFile(e)) {
		(e as any).currentTarget.value = null;
		isLargeImage.value = true;
		setTimeout(() => {
			isLargeImage.value = false;
		}, 3000);
	}

	if (!isAcceptedExtension(e, acceptedImageExtensions.value)) {
		(e as any).currentTarget.value = null;
		isInvalidExtension.value = true;
		setTimeout(() => {
			isInvalidExtension.value = false;
		}, 3000);
	}

	image.value = (e as any).currentTarget.files.length
		? URL.createObjectURL((e as any).currentTarget.files[0])
		: "";
}

function addNotification(e: Event) {
	disabledForm.value = true;
	if (newNotification.value.premium_app_type === "not") {
		newNotification.value.days_without_subscription = 0;
	}
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	requiredFields.forEach((field) => {
		if (
			newNotification.value.hasOwnProperty(field as keyof Notification) &&
			newNotification.value[field as keyof Notification] === ""
		)
			error.value.push(field);
	});

	if (error.value.length) {
		disabledForm.value = false;
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}

	loading.value = true;

	store.addNotification(fd).then((r: ReturnedData | ReturnedError) => {
		disabledForm.value = false;
		loading.value = false;
		if (r.success) {
			newNotification.value = clearVariable(newNotification.value);
			router.push({ name: "Notifications" });
		} else {
			currentError.value = r.error.status;
			console.log(currentError.value);

			setTimeout(() => {
				currentError.value = "";
			}, 2000);
		}
	});
}
</script>

<style scoped lang="scss">
@import "../style.scss";

$file-input-color: #dbd4ff;
$file-input-error-color: #ff4545;
.notification-create {
	.form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: 450px;
		width: 100%;

		&__label,
		&__file-input,
		&__input,
		.input-container {
			width: 100%;
		}

		.file-input {
			background-color: rgba($color: $file-input-color, $alpha: 0.23);
			border: 0.2rem solid $file-input-color;
			border-radius: 1rem;
			position: relative;
			display: flex;
			justify-content: center;
			box-sizing: content-box;
			width: 25rem;
			height: 10rem;

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
		&__comment {
			color: var(--c__grey);
			font-size: 0.9rem;
		}

		&__file-input,
		label + input,
		.select-container {
			margin-bottom: 1.2rem;
		}

		&__input {
			border: 0.1rem solid var(--c__grey);
			border-radius: 0.6rem;
			font: {
				size: 1.25rem;
			}
			height: 2.8rem;
			padding: 0 1rem;

			&._error {
				border-color: $file-input-error-color;
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
			margin-top: 1rem;
		}

		div {
			width: 100%;
			display: flex;
			flex-direction: column;
		}

		.input-container {
			display: flex;
			flex-direction: row;
			width: auto;

			&__wrapper {
				display: flex;
				flex-direction: column;
				margin-right: 1.5rem;
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
				width: 100%;

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
			}

			button {
				margin-top: 2rem;
			}
		}
	}
}
</style>