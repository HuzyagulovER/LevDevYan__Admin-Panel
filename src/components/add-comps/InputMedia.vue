<template>
	<div class="media-input" :class="{
		_error:
			isLargeMedia ||
			isInvalidExtension ||
			fileErrorStatuses.indexOf(currentError) !== -1,
	}">
		<div class="media-input__media">
			<IconClip />
			<p v-if="media && /blob:/i.test(media)">
				{{ "Файл будет загружен" }}
			</p>
			<p v-else-if="isLargeMedia || currentError === 'FILE_SIZE_EXCEEDED'">
				Файл должен быть не больше {{ maxMediaSizeText }}
			</p>
			<p v-else-if="isInvalidExtension || currentError === 'INVALID_FILE_EXTENSION'
				">
				Файл должен иметь верное расширение ({{
					acceptedMediaExtensions.join(", ")
				}})
			</p>
			<div v-show="!media && !(!!currentError || isLargeMedia || isInvalidExtension)
					">
				<p>Прикрепить аудио или видео (.mp3/.mp4)</p>

				<input :id="name" type="file" :accept="acceptedMediaExtensions.join(',')" :name="name" :disabled="disabled"
					@change="displayMedia($event)" ref="formMedia" />
			</div>
		</div>

		<!-- <IconTrash @click="deleteImage" class="media-input__delete icon-trash" v-if="media" /> -->
	</div>
</template>

<script setup lang="ts">
import IconClip from "@icons/IconClip.vue";
import { ref, Ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const props = defineProps<{
	media?: string;
	currentError: string;
	disabled: boolean;
	name: string;
}>();
const emit = defineEmits(["displayMedia"]);
const store = <StoreGeneric>inject("Store");
const { acceptedMediaExtensions, fileErrorStatuses } = storeToRefs(store);
const isLargeFile: any = inject("isLargeFile");
const maxMediaSize: any = inject("maxMediaSize");
const maxMediaSizeText: any = inject("maxMediaSizeText");
const isAcceptedExtension: any = inject("isAcceptedExtension");

let isLargeMedia: Ref<boolean> = ref(false);
let isInvalidExtension: Ref<boolean> = ref(false);
let media: Ref<string> = ref("");
let formMedia: Ref = ref();

media.value = props.media ?? '';

watch(
	() => props.media,
	() => {
		media.value = props.media ?? '';
	}
);

watch(
	() => props.currentError,
	(): void => {
		if (props.currentError !== "") {
			formMedia.value = null;
			media.value = "";
		}
	}
);

function displayMedia(e: Event): void {
	if (isLargeFile(e, maxMediaSize)) {
		(e as any).currentTarget.value = null;
		isLargeMedia.value = true;
		setTimeout(() => {
			isLargeMedia.value = false;
		}, 3000);
	}

	if (!isAcceptedExtension(e, [...acceptedMediaExtensions.value, "mpeg"])) {
		(e as any).currentTarget.value = null;
		isInvalidExtension.value = true;
		setTimeout(() => {
			isInvalidExtension.value = false;
		}, 3000);
	}

	if ((e as any).currentTarget.files.length) {
		media.value = URL.createObjectURL((e as any).currentTarget.files[0]);
		emit("displayMedia", true);
	} else {
		media.value = "";
		emit("displayMedia", false);
	}
}

function deleteImage() {
	media.value = "";
	if (formMedia.value && formMedia.value.files && formMedia.value.files.length)
		formMedia.value = "";
	emit("displayMedia", false);
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.media-input {
	display: flex;
	justify-content: center;
	box-sizing: content-box;

	&__container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	&__media {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		position: relative;

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
		margin-right: 0.5rem;
	}

	p,
	a {
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
		opacity: 0;
		cursor: pointer;

		&::-webkit-file-upload-button {
			display: none;
		}
	}

	&._error {
		// background-color: rgba($color: $input-error-color, $alpha: 0.23);

		p {
			color: $input-error-color;
		}

		svg {
			fill: $input-error-color;
		}
	}

	&__delete {
		opacity: 0;
		transition: var(--transition-03);
	}

	&:hover &__delete {
		opacity: 1;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		border-width: 0.3rem;
		width: auto;

		a,
		p {
			font-size: 1.3rem;
		}

		svg {
			width: 1.8rem;
			height: 1.8rem;
		}

		&__delete {
			opacity: 1;
			transition: unset;
		}
	}
}
</style>