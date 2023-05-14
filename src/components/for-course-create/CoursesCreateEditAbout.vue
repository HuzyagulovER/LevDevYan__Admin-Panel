<template>
	<div class="create-edit-about">
		<form
			class="create-edit-about__form form"
			enctype="multipart/form-data"
			@submit.prevent="saveCourse($event)"
		>
			<InputImage
				class="form__file-input"
				:image="image"
				:name="'image'"
				:currentError="currentError"
				:disabled="disabledForm"
				@display-image="displayImage"
			/>

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
import InputImage from "@add-comps/InputImage.vue";
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
const { loadedFiles, languages, acceptedImageExtensions, imageErrorStatuses } =
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

function displayImage(isImage: boolean): void {
	isImageLoaded.value = isImage;
	if (!isImage) {
		props.data.image = "";
	}
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
		loadedFiles.value["course_images"] = fd.get("image");
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

.create-edit-about {
	@media screen and (max-width: $mobile--breakpoint) {
		.form {
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