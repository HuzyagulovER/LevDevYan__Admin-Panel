<template>
	<div class="media-block">
		<PreviewMedia :media="media" :file_size="file_size" v-show="media" />
		<InputMedia :media="media" :name="'content_media_' + hash" :currentError="currentError" :disabled="disabled"
			@display-media="displayMedia($event)" v-show="!media" />
		<IconTrash @click="deleteImage" class="media-block__delete icon-trash" v-show="media" />
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import InputMedia from "@add-comps/InputMedia.vue";
import PreviewMedia from "./PreviewMedia.vue";
import { ref, Ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	ContentText,
} from "../../../helpers";

const props = defineProps<{
	hash: string
	text: ContentText,
	currentError: string
	disabled: boolean
}>();
const emit = defineEmits(["displayMedia"]);
const store = <StoreGeneric>inject("Store");

let media: Ref<string> = ref(""),
	file_size: Ref<string> = ref(""),
	formMedia: Ref = ref();

media.value = props.text.media ?? '';
file_size.value = props.text.file_size ?? '';

watch(
	() => props.text.media,
	() => {
		media.value = props.text.media ?? '';
	}
);
watch(
	() => props.text.file_size,
	() => {
		file_size.value = props.text.file_size ?? '';
	}
);

function displayMedia(isMedia: boolean): void {
	console.log(isMedia);
	emit("displayMedia", isMedia);
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

.media-block {
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