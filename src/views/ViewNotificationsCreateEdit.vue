<template>
	<section class="notification-create">
		<form
			class="notification-create__form form"
			@submit.prevent="notificationChangeHandler($event)"
		>
			<InputImage
				class="form__file-input"
				:image="image"
				:name="'notification_image'"
				:currentError="currentError"
				:disabled="disabledForm"
				@display-image="displayImage($event)"
			/>

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
						v-model="notification.time"
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
						:disabled="disabledForm || notification.repeat_times !== 1"
						v-model="notification.date"
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
				:disabled="disabledForm || isAndroid"
				v-model="notification.title"
				@input="error = clearVariable(error)"
			/>

			<label for="input_body" class="form__label">Текст</label>
			<input
				id="input_body"
				type="text"
				name="body"
				class="form__input"
				:class="{ _error: error.includes('body') }"
				:disabled="disabledForm || isAndroid"
				v-model="notification.body"
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
				v-model="notification.repeat_times"
				@input="error = clearVariable(error)"
				min="-1"
			/>

			<label for="input_app" class="form__label">Приложение</label>
			<div class="select-container">
				<select
					id="input_app"
					name="app"
					class="form__input"
					:class="{ _error: error.includes('app') }"
					v-model="notification.app"
					:disabled="disabledForm"
				>
					<option v-for="app in apps" :key="app" :value="app.toLowerCase()">
						{{ app }}
					</option>
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
					v-model="notification.premium_app_type"
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
				v-model="notification.type"
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
					v-model="notification.type"
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
					v-model="notification.lang"
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
				v-model="notification.days_without_open_app"
				@input="error = clearVariable(error)"
				min="0"
			/>

			<div v-if="notification.premium_app_type === 'not'">
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
					v-model="notification.days_without_subscription"
					@input="error = clearVariable(error)"
					min="0"
				/>
			</div>

			<label for="input_os" class="form__label">ОС для доп информации</label>
			<div class="select-container">
				<select
					id="input_os"
					name="os"
					class="form__input"
					v-model="notification.os"
					:disabled="disabledForm"
					@input="osChange"
				>
					<option value="">Нет выбора</option>
					<option v-for="(os, key) in OS" :key="key" :value="key">
						{{ os }}
					</option>
				</select>
			</div>

			<label for="input_info" class="form__label" v-if="notification.os">
				Дополнительная информация
			</label>
			<input
				v-if="notification.os"
				id="input_info"
				type="text"
				name="info"
				class="form__input"
				:class="{ _error: error.includes('info') }"
				:disabled="disabledForm"
				v-model="notification.info"
				@input="error = clearVariable(error)"
			/>

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
import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { inject, watch, onMounted, computed } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	Notification,
	Notifications,
	ReturnedData,
	ReturnedError,
} from "../../helpers";
import ButtonColored from "@add-comps/ButtonColored.vue";
import InputImage from "@add-comps/InputImage.vue";
import { useRoute, useRouter } from "vue-router";
import { cloneDeep, merge } from "lodash";

const store = <StoreGeneric>inject("Store");
const {
	loading,
	premiumAppTypes,
	languages,
	acceptedImageExtensions,
	imageErrorStatuses,
	apps,
	OS,
} = storeToRefs(store);
const clearVariable = <Function>inject("clearVariable");
const route = useRoute();
const router = useRouter();

const requiredFields: ReadonlyArray<string> = [
	"lang",
	"time",
	"app",
	"premium_app_type",
];

const notification: Ref<Notification> = ref({
	lang: "",
	title: "",
	body: "",
	date: "",
	time: "",
	app: "",
	repeat_times: 0,
	premium_app_type: "",
	days_without_open_app: 0,
	days_without_subscription: 0,
	os: "",
	info: "",
});

const disabledForm: Ref<boolean> = ref(false);
const error: Ref<Array<string>> = ref([]);
const image: Ref<string> = ref("");
const currentError: Ref<string> = ref("");
const isNew: Ref<boolean> = ref(true);
const isImageLoaded: Ref<boolean> = ref(false);

const isAndroid: ComputedRef<boolean> = computed((): boolean => {
	notification.value.title = "";
	notification.value.body = "";
	return notification.value.os === "android";
});

if (route.params.notificationId !== "new") {
	loading.value = true;
	isNew.value = false;

	store.getNotification(route.params.notificationId).then((r: any) => {
		loading.value = false;
		if (Array.isArray(r)) {
			router.replace({ path: "/notifications" });
		}
		notification.value = cloneDeep(
			<Notification>(
				(r as Notifications)[route.params.notificationId as keyof Notifications]
			)
		);
		image.value = <string>notification.value.image;
	});
}

watch(
	() => notification.value.repeat_times,
	() => {
		if (notification.value.repeat_times !== 1) notification.value.date = "";
	}
);

function displayImage(isImage: boolean): void {
	isImageLoaded.value = isImage;
	if (!isImage) {
		image.value = "";
	}
}

function notificationChangeHandler(e: Event): void {
	disabledForm.value = true;

	if (notification.value.premium_app_type === "not") {
		notification.value.days_without_subscription = 0;
	}

	const fd: FormData = new FormData(e.target as HTMLFormElement);

	requiredFields.forEach((field) => {
		if (
			notification.value.hasOwnProperty(field as keyof Notification) &&
			notification.value[field as keyof Notification] === ""
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

	if (!isImageLoaded.value) {
		fd.delete("notification_image");
		fd.append("image", image.value);
	}

	loading.value = true;

	if (isNew.value) {
		store
			.addNotification(fd)
			.then((r: ReturnedData | ReturnedError) => returnHandler(r));
	} else {
		fd.append("notification_id", <string>notification.value.notification_id);
		store
			.updateNotification(fd)
			.then((r: ReturnedData | ReturnedError) => returnHandler(r));
	}
}

function returnHandler(r: ReturnedData | ReturnedError) {
	disabledForm.value = false;
	loading.value = false;

	if (r.success) {
		notification.value = clearVariable(notification.value);
		router.push({ name: "Notifications" });
	} else {
		currentError.value = r.error.status;

		setTimeout(() => {
			currentError.value = "";
		}, 2000);
	}
}

function osChange(): void {
	if (notification.value.os === "android") {
	}
}

/*
function addNotification(e: Event) {
	disabledForm.value = true;
	if (notification.value.premium_app_type === "not") {
		notification.value.days_without_subscription = 0;
	}
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	requiredFields.forEach((field) => {
		if (
			notification.value.hasOwnProperty(field as keyof Notification) &&
			notification.value[field as keyof Notification] === ""
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
			notification.value = clearVariable(notification.value);
			router.push({ name: "Notifications" });
		} else {
			currentError.value = r.error.status;

			setTimeout(() => {
				currentError.value = "";
			}, 2000);
		}
	});
}
*/
</script>

<style scoped lang="scss">
@import "../style.scss";

.notification-create {
	.form {
		max-width: 450px;

		&__comment {
			color: var(--c__grey);
			font-size: 0.9rem;
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