<template>
	<div class="create-edit-about">
		<form
			class="create-edit-about__form form"
			enctype="multipart/form-data"
			@submit.prevent="saveCourse($event)"
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

			<label for="promocode" class="form__label">Срок</label>
			<input
				id="period"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('period') }"
				name="period"
				:disabled="disabledForm"
				v-model="data.period"
				@input="error = clearVariable(error)"
			/>

			<label for="promocode" class="form__label" v-if="false">Стоимость</label>
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

			<label for="promocode" class="form__label" v-if="false">Категория</label>
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

			<label for="promocode" class="form__label">Описание</label>
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

			<label for="promocode" class="form__label">Кому подойдет</label>
			<textarea
				id="whom"
				type="text"
				class="form__textarea"
				:class="{ _error: error.includes('whom') }"
				name="whom"
				:disabled="disabledForm"
				v-model="data.whom"
				@input="error = clearVariable(error)"
			></textarea>

			<label for="promocode" class="form__label">Результаты</label>
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

			<ButtonGreen type="submit" :disabled="disabledForm"></ButtonGreen>
		</form>
	</div>
</template>

<script setup lang="ts">
import IconImage from "@icons/IconImage.vue";
import ButtonGreen from "@add-comps/ButtonGreen.vue";
import { ref, Ref } from "@vue/reactivity";
import { CourseAbout } from "../../../helpers";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const props = defineProps<{ data: CourseAbout }>();
const emit = defineEmits(["saveCourse"]);
const store = <StoreGeneric>inject("Store");
const { loadedFile } = storeToRefs(store);

let disabledForm: Ref<boolean> = ref(false);
let error: Ref<Array<string>> = ref([]);
let clearVariable: any = inject("clearVariable");
const formData: FormData = new FormData();
let image: Ref<string> = ref("");
let isImageLoaded: Ref<boolean> = ref(false);

const requiredFields: ReadonlyArray<string> = [
	"category",
	"description",
	"period",
	"price",
	"results",
	"title",
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

function displayImage(e: Event): void {
	image.value = URL.createObjectURL((e as any).target.files[0]);
	console.log(image.value);

	isImageLoaded.value = true;
}

function saveCourse(e: Event): void {
	disabledForm.value = true;
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	fd.forEach((v, k) => {
		if (v === "" && requiredFields.indexOf(k) !== -1) error.value.push(k);
	});

	if (error.value.length) {
		disabledForm.value = false;
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}

	if (isImageLoaded.value) {
		loadedFile.value = fd.get("image");
	}

	emit("saveCourse");
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

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

		$file-input-color: #dbd4ff;
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

			&._error {
				border-color: red;
			}
		}

		&__textarea {
			height: auto;
			min-height: 10rem;
			max-height: 20rem;
			resize: vertical;
			padding: 0.5rem 1rem;
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