<template>
	<div
		class="file-input"
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
			:name="name"
			:disabled="disabled"
			@change="displayImage($event)"
			ref="formImage"
		/>
		<IconTrash @click="deleteImage" class="file-input__delete icon-trash" />
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import IconImage from "@icons/IconImage.vue";
import { ref, Ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const props = defineProps<{
	image: string;
	currentError: string;
	disabled: boolean;
	name: string;
}>();
const emit = defineEmits(["displayImage"]);
const store = <StoreGeneric>inject("Store");
const { acceptedImageExtensions, imageErrorStatuses } = storeToRefs(store);
const isLargeFile: any = inject("isLargeFile");
const maxFileSizeText: any = inject("maxFileSizeText");
const isAcceptedExtension: any = inject("isAcceptedExtension");

let isLargeImage: Ref<boolean> = ref(false);
let isInvalidExtension: Ref<boolean> = ref(false);
let image: Ref<string> = ref("");
let formImage: Ref = ref();

image.value = props.image;

watch(
	() => props.image,
	() => {
		image.value = props.image;
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

	if ((e as any).currentTarget.files.length) {
		image.value = URL.createObjectURL((e as any).currentTarget.files[0]);
		emit("displayImage", true);
	} else {
		image.value = "";
		emit("displayImage", false);
	}
}

function deleteImage() {
	image.value = "";
	if (formImage.value.files && formImage.value.files.length)
		formImage.value = "";
	emit("displayImage", false);
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

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
		background-color: rgba($color: $input-error-color, $alpha: 0.23);
		border: 0.2rem solid $input-error-color;

		p {
			color: $input-error-color;
		}

		svg {
			fill: $input-error-color;
		}
	}

	&__delete {
		position: absolute;
		top: 0.3rem;
		right: 0.3rem;
		opacity: 0;
		transition: var(--transition-03);
	}

	&:hover &__delete {
		opacity: 1;
	}

	@media screen and (max-width: $mobile--breakpoint) {
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
}
</style>