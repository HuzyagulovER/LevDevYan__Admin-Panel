<template>
	<div class="media-preview">
		<div class="media-preview__media">
			<div class="media-preview__container" v-if="/\.mp3/i.test(media)">
				<IconPlay v-if="isPaused" class="media-preview__play play-button" @click="toggleAudio(true)" />
				<IconPause v-else class="media-preview__pause pause-button" @click="toggleAudio(false)" />
				<p>Аудио / {{ file_size }} / <span class="media-preview__help" :title="media">{{
					media.split("/").slice(-1)[0].slice(0, maxFilenameLength)
					+ "..." }}</span> / <span class="media-preview__grey">Время: </span> {{ playtime_string }}</p>
				<audio controls ref="audio" v-show="false" @ended="isPaused = true">
					<source :src="media" type="audio/mp3">
				</audio>
			</div>
			<div v-else>
				<p>
					<a :href="media" target="_blank">Просмотреть видео</a>
					/ {{ file_size }} /
					<span :title="media">{{ media.split("/").slice(-1)[0].slice(0, maxFilenameLength) + "..." }}</span>
					/ <span class="media-preview__grey">Время: </span> {{ playtime_string }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconPlay from "@icons/IconPlay.vue";
import IconPause from "@icons/IconPause.vue";
import { ref, Ref, ComputedRef, computed } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const props = defineProps<{
	media?: string;
	file_size?: string
	playtime_string?: string
}>();

const emit = defineEmits(["displayMedia"]),
	store = <StoreGeneric>inject("Store"),
	{ acceptedMediaExtensions, fileErrorStatuses } = storeToRefs(store),
	isLargeFile: any = inject("isLargeFile"),
	maxMediaSize: any = inject("maxMediaSize"),
	isAcceptedExtension: any = inject("isAcceptedExtension"),
	maxFilenameLength: number = 20;

let isLargeMedia: Ref<boolean> = ref(false),
	isInvalidExtension: Ref<boolean> = ref(false),
	media: Ref<string> = ref(""),
	formMedia: Ref = ref(),
	audio: Ref = ref(),
	isPaused: Ref<boolean> = ref(true);


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

function toggleAudio(param: boolean): void {
	if (param) {
		audio.value.play().then((): void => isPaused.value = audio.value?.paused)
	} else {
		audio.value.pause()
		isPaused.value = audio.value?.paused
	}

}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.media-preview {
	display: flex;
	justify-content: center;
	box-sizing: content-box;

	&__container {
		display: flex;
		align-items: center;
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

	&__play,
	&__pause {
		width: 2rem;
		height: 2rem;
		margin-right: 0.5rem;
		cursor: pointer;
	}

	p,
	a,
	span {
		color: $--c__violet;
		line-height: 1.5rem;

		font: {
			size: 1.5rem;
			family: var(--f__mazzard-sb);
		}
	}

	&__help {
		cursor: help;
	}

	&__grey {
		color: $--c__grey !important;
	}

	a:hover {
		color: $--c__orange;
	}

	// input {
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	width: 100%;
	// 	height: 100%;
	// 	opacity: 0;
	// 	cursor: pointer;

	// 	&::-webkit-file-upload-button {
	// 		display: none;
	// 	}
	// }

	// &._error {
	// 	// background-color: rgba($color: $input-error-color, $alpha: 0.23);

	// 	p {
	// 		color: $input-error-color;
	// 	}

	// 	svg {
	// 		fill: $input-error-color;
	// 	}
	// }
	// @media screen and (max-width: $mobile--breakpoint) {
	// 	border-width: 0.3rem;
	// 	width: auto;

	// 	a,
	// 	p {
	// 		font-size: 1.3rem;
	// 	}

	// 	svg {
	// 		width: 1.8rem;
	// 		height: 1.8rem;
	// 	}
	// }
}
</style>