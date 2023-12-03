<template>
	<div class="media-preview">
		<div class="media-preview__media">
			<div v-if="/\.mp3/i.test(media)">
				<IconPlay class="play-button" />
				<p>Прослушать аудио</p>
			</div>
			<div v-else>
				<a :href="media" target="_blank">Просмотреть видео</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import IconPlay from "@icons/IconPlay.vue";
import { ref, Ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const props = defineProps<{
	media?: string;
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

.media-preview {
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