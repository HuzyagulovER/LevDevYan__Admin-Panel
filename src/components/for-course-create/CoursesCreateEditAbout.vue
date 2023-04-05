<template>
	<div class="create-edit-about">
		<form
			class="create-edit-about__form form"
			enctype="multipart/form-data"
			@submit.prevent="saveCourse($event)"
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
					id="image"
					type="file"
					:accept="acceptedImageExtensions.join(',')"
					name="image"
					:disabled="disabledForm"
					@change="displayImage($event)"
					ref="formImage"
				/>

				<IconTrash
					class="file-input__delete"
					@click="deleteImage"
					v-if="image"
				/>
			</div>

			<label for="promocode" class="form__label">Название</label>
			<input
				id="title"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('title') }"
				name="title"
				:disabled="disabledForm"
				v-model="data.title"
				@input="error = clearVariable(error)"
			/>

			<!-- <label for="input_lang" class="form__label">Язык</label>
			<select
				id="input_lang"
				name="lang"
				class="form__input"
				:class="{ _error: error.includes('lang') }"
				v-model="data.lang"
				:disabled="disabledForm"
			>
				<option v-for="(language, j) in languages" :key="j" :value="j">
					{{ language }}
				</option>
			</select> -->

			<label for="period" class="form__label">Продолжительность в днях</label>
			<input
				id="period"
				type="number"
				class="form__input"
				min="0"
				:class="{ _error: error.includes('period') }"
				name="period"
				:disabled="disabledForm"
				v-model="data.period"
				@input="error = clearVariable(error)"
			/>

			<label for="price" class="form__label" v-if="false">Стоимость</label>
			<input
				id="price"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('price') }"
				name="price"
				:disabled="disabledForm"
				v-model="data.price"
				@input="error = clearVariable(error)"
				v-if="false"
			/>

			<label for="category" class="form__label" v-if="false">Категория</label>
			<input
				id="category"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('category') }"
				name="category"
				:disabled="disabledForm"
				v-model="data.category"
				@input="error = clearVariable(error)"
				v-if="false"
			/>

			<label for="description" class="form__label">Описание</label>
			<textarea
				id="description"
				type="text"
				class="form__textarea"
				:class="{ _error: error.includes('description') }"
				name="description"
				:disabled="disabledForm"
				v-model="data.description"
				@input="error = clearVariable(error)"
			>
			</textarea>

			<label for="for_whom" class="form__label">Кому подойдет</label>
			<textarea
				id="for_whom"
				type="text"
				class="form__textarea"
				:class="{ _error: error.includes('for_whom') }"
				name="for_whom"
				:disabled="disabledForm"
				v-model="data.for_whom"
				@input="error = clearVariable(error)"
			></textarea>

			<label for="results" class="form__label">Результаты</label>
			<textarea
				id="results"
				type="text"
				class="form__textarea"
				:class="{ _error: error.includes('results') }"
				name="results"
				:disabled="disabledForm"
				v-model="data.results"
				@input="error = clearVariable(error)"
			></textarea>

			<ButtonColored type="submit" :disabled="disabledForm"></ButtonColored>
		</form>
	</div>
</template>

<script setup lang="ts">
import IconImage from "@icons/IconImage.vue";
import IconTrash from "@icons/IconTrash.vue";
import ButtonColored from "@add-comps/ButtonColored.vue";
import { ref, Ref } from "@vue/reactivity";
import { CourseAbout } from "../../../helpers";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const props = defineProps<{
	data: CourseAbout;
	courseId: string;
	currentError: string;
	disabledForm: boolean;
}>();
const emit = defineEmits(["saveCourse", "updateCourse"]);
const store = <StoreGeneric>inject("Store");
const { loadedFile, languages, acceptedImageExtensions, imageErrorStatuses } =
	storeToRefs(store);
const clearVariable = <Function>inject("clearVariable");
const isLargeFile: any = inject("isLargeFile");
const maxFileSizeText: any = inject("maxFileSizeText");
const isAcceptedExtension: any = inject("isAcceptedExtension");

let error: Ref<Array<string>> = ref([]);
let image: Ref<string> = ref("");
let isImageLoaded: Ref<boolean> = ref(false);
let isLargeImage: Ref<boolean> = ref(false);
let isInvalidExtension: Ref<boolean> = ref(false);
let formImage: Ref = ref();

const requiredFields: ReadonlyArray<string> = [
	"title",
	"lang",
	"period",
	"description",
	"for_whom",
	"results",
];

if (props.data.image) {
	image.value = <string>props.data.image;
}

watch(
	() => props.data.image,
	(): void => {
		image.value = <string>props.data.image;
	}
);

watch(
	() => props.currentError,
	(): void => {
		if (props.currentError !== "") {
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
	isImageLoaded.value = true;
}

function deleteImage() {
	props.data.image = "";
	image.value = "";
	if (formImage.value.files.length) formImage.value = "";
	isImageLoaded.value = false;
}

function saveCourse(e: Event): void {
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	fd.forEach((v, k) => {
		if (v === "" && requiredFields.indexOf(k) !== -1) error.value.push(k);
	});

	requiredFields.forEach((field) => {
		if (
			props.data.hasOwnProperty(field as keyof CourseAbout) &&
			props.data[field as keyof CourseAbout] === ""
		)
			error.value.push(field);
	});

	if (props.data.period <= 0) error.value.push("period");

	if (error.value.length) {
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}

	if (isImageLoaded.value) {
		loadedFile.value = fd.get("image");
	}

	if (props.courseId.toLowerCase() !== "new") {
		emit("updateCourse");
	} else {
		emit("saveCourse");
	}
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

$file-input-color: #dbd4ff;
$file-input-error-color: #ff4545;
.create-edit-about {
	.form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;

		&__label,
		&__file-input,
		&__input,
		&__textarea {
			width: 100%;
		}

		.file-input {
			aspect-ratio: 65/28;
			background-color: rgba($color: $file-input-color, $alpha: 0.23);
			border: 0.2rem solid $file-input-color;
			border-radius: 1rem;
			position: relative;
			display: flex;
			justify-content: center;
			max-height: 166px;
			max-width: 392px;
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

			&__delete {
				position: absolute;
				width: 2.3rem;
				height: 2.3rem;
				fill: var(--c__red);
				cursor: pointer;
				opacity: 0;
				transition: var(--transition-03);
				top: 1rem;
				right: 1rem;
			}

			svg:not(.file-input__delete) {
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

			&:hover {
				.file-input__delete {
					opacity: 1;
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
		&__input,
		&__textarea {
			margin-bottom: 1.2rem;
		}

		&__input,
		&__textarea {
			border: 0.1rem solid #999999;
			border-radius: 0.6rem;
			font: {
				size: 1.25rem;
			}
			height: 3rem;
			padding: 0 1rem;
		}

		&__textarea {
			height: auto;
			min-height: 10rem;
			max-height: 20rem;
			resize: vertical;
			padding: 0.5rem 1rem;
		}

		&__input select {
			border: 0;
			width: 100%;
			height: 100%;
			font-size: inherit;
			background-color: transparent;
		}

		button {
			margin-left: auto;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.form {
			.file-input {
				border-width: 0.3rem;
				height: 18rem;
			}

			&__label {
				margin-bottom: 0.5rem;
				font: {
					size: 2.2rem;
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
		}
	}
}
</style>