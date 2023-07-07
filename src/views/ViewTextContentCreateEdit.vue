<template>
	<section class="content-create-edit">
		<form
			class="content-create-edit__form form"
			@submit.prevent="contentChangeHandler"
		>
			<InputImage
				class="form__file-input"
				:image="image"
				:name="'content_image'"
				:currentError="currentError"
				:disabled="disabledForm"
				@display-image="displayImage($event, 'content_image')"
			/>

			<label for="input_title" class="form__label">Название</label>
			<input
				id="input_title"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('title') }"
				name="title"
				:disabled="disabledForm"
				v-model="activeContent.title"
				@input="error = clearVariable(error)"
			/>

			<label for="input_app" class="form__label">Приложение</label>
			<input
				id="input_app"
				name="app"
				type="text"
				list="input_app_datalist"
				class="form__input"
				:class="{ _error: error.includes('app') }"
				v-model="activeContent.app"
				:disabled="disabledForm"
			/>
			<datalist id="input_app_datalist">
				<option v-for="app in apps" :key="app">
					{{ app }}
				</option>
			</datalist>
			<!-- <select
					id="input_app"
					name="app"
					class="form__input"
					:class="{ _error: error.includes('app') }"
					v-model="activeContent.app"
					:disabled="disabledForm"
				>
					<option value="other">Другое</option>
				</select> -->

			<label for="input_lang" class="form__label">Язык</label>
			<div class="select-container">
				<select
					id="input_lang"
					name="lang"
					class="form__input"
					:class="{ _error: error.includes('lang') }"
					v-model="activeContent.lang"
					:disabled="disabledForm"
				>
					<option v-for="(language, j) in languages" :key="j" :value="j">
						{{ language }}
					</option>
				</select>
			</div>

			<label for="input_type" class="form__label">Тип</label>
			<input
				id="input_type"
				type="text"
				class="form__input"
				:class="{ _error: error.includes('type') }"
				name="type"
				:disabled="disabledForm"
				v-model="activeContent.type"
				@input="error = clearVariable(error)"
			/>

			<div class="form__texts-top-line justify-space-between">
				<ButtonCreate
					class="form__button-create"
					@click.prevent="createNewText"
				>
					Добавить текст
				</ButtonCreate>

				<div
					class="form__texts-toggler texts-toggler"
					:class="{ opened: opened }"
				>
					<p>Текст ({{ Object.keys(activeContent.texts).length }})</p>
					<IconCorner class="texts-toggler__corner" @click="toggleTexts" />
				</div>
			</div>

			<OpeningList class="form__texts texts" :isOpen="opened">
				<TransitionGroup tag="div" name="list">
					<div
						class="texts__text text"
						v-for="(text, j, i) in activeContent.texts"
						:key="j"
					>
						<div class="text__top-line">
							<label class="form__label">Текст {{ i + 1 }}</label>
							<InputMedia
								class="form__media-input"
								:media="activeContent.texts[j].media"
								:name="'content_media_' + j"
								:currentError="currentError"
								:disabled="disabledForm"
								@display-media="displayMedia($event, j)"
							/>
						</div>
						<div class="text__delete">
							<IconTrash
								class="text__icon icon-trash"
								@click="confirmDeleteText(j)"
							/>
						</div>
						<!-- <div class="text__wrapper"> -->
						<div>
							<textarea
								class="form__textarea text__textarea"
								v-model="activeContent.texts[j].text"
							></textarea>
						</div>
						<div>
							<InputImage
								class="text__file-input"
								:image="activeContent.texts[j].image"
								:name="'content_image_' + j"
								:currentError="currentError"
								:disabled="disabledForm"
								@display-image="displayImage($event, j)"
							/>
						</div>
					</div>
				</TransitionGroup>
			</OpeningList>

			<div class="form__container justify-end">
				<ButtonColored
					type="submit"
					:disabled="disabledForm"
					class="form__button"
				></ButtonColored>
			</div>
		</form>
	</section>
</template>

<script setup lang="ts">
import IconTrash from "@icons/IconTrash.vue";
import OpeningList from "@add-comps/OpeningList.vue";
import IconCorner from "@icons/IconCorner.vue";
import ButtonColored from "@add-comps/ButtonColored.vue";
import InputImage from "@add-comps/InputImage.vue";
import InputMedia from "@add-comps/InputMedia.vue";
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import { useRoute, useRouter } from "vue-router";
import {
	computed,
	ComputedRef,
	inject,
	onMounted,
	onUnmounted,
	ref,
	Ref,
	watch,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	Content,
	ContentList,
	ReturnedData,
	ReturnedError,
	ContentText,
} from "../../helpers";
import { cloneDeep } from "lodash";

const store = <StoreGeneric>inject("Store");
const clearVariable = <Function>inject("clearVariable");
const getSHA256Hash = <Function>inject("getSHA256Hash");
const {
	contentList,
	defaultContent,
	loading,
	mainTitle,
	languages,
	apps,
	loadedFiles,
	activeApp,
} = storeToRefs(store);
const route = useRoute();
const router = useRouter();

const requiredFields: ReadonlyArray<string> = ["title", "app", "type"];
const disabledForm: Ref<boolean> = ref(false);
const activeContent: Ref<Content> = ref(cloneDeep(defaultContent.value));
const page: ComputedRef<string> = computed(() => {
	return route.path.split("/")[route.path.split("/").length - 1];
});
const currentError: Ref<string> = ref("");
const error: Ref<Array<string>> = ref([]);
const image: Ref<string> = ref("");
const media: Ref<string> = ref("");
const isNew: Ref<boolean> = ref(true);
const opened: Ref<boolean> = ref(false);
const isImageLoaded: Ref<boolean> = ref(false);
const isMediaLoaded: Ref<boolean> = ref(false);
const imagesCount: Ref<number> = ref(0);
const mediaCount: Ref<number> = ref(0);

if (route.params.contentId === "new") {
	mainTitle.value = "Создание контента";
	onMounted(() => {
		changeLang(Object.keys(languages.value)[0]);
	});

	activeContent.value.app =
		activeApp.value !== "" ? apps.value[activeApp.value] : activeApp.value;
} else {
	isNew.value = false;
	mainTitle.value = "Редактирование контента";
	store
		.getContent("", "", route.params.contentId)
		.then((r: ContentList | Array<null>) => {
			if (Array.isArray(r)) {
				router.replace({ path: "/content" });
			}
			activeContent.value = <Content>(
				r[route.params.contentId as keyof ContentList]
			);

			if (apps.value[activeContent.value.app]) {
				activeContent.value.app = apps.value[activeContent.value.app];
			}

			image.value = activeContent.value.image;
		});
}

loading.value = false;

onUnmounted(() => {
	mainTitle.value = "";
});

watch(
	() => image.value,
	(): void => {
		activeContent.value.image = image.value;
	}
);

watch(
	() => currentError,
	(): void => {
		if (currentError.value === "") disabledForm.value = false;
	}
);

function displayImage(isImage: boolean, id: string | number): void {
	isImageLoaded.value = isImage;
	isImage ? imagesCount.value++ : imagesCount.value--;

	if (id === "content_image") {
		if (!isImage) {
			image.value = "";
		}
	} else {
		if (!isImage) {
			activeContent.value.texts[id].image = "";
		}
	}
}

function displayMedia(isMedia: boolean, id: string | number): void {
	isMediaLoaded.value = isMedia;
	isMedia ? mediaCount.value++ : mediaCount.value--;

	if (id === "content_media") {
		if (!isMedia) {
			media.value = "";
		}
	} else {
		if (!isMedia) {
			activeContent.value.texts[id].media = "";
		}
	}
}

function contentChangeHandler(e: Event): void {
	const fd: FormData = new FormData(e.target as HTMLFormElement);

	disabledForm.value = true;
	loading.value = true;

	if (isImageLoaded.value) {
		for (const [name, value] of fd) {
			if (typeof value === "object" && (value as File).size) {
				loadedFiles.value[name] = fd.get(name);
			}
		}
	}

	if (isMediaLoaded.value) {
		for (const [name, value] of fd) {
			if (typeof value === "object" && (value as File).size) {
				loadedFiles.value[name] = fd.get(name);
			}
		}
	}

	requiredFields.forEach((field) => {
		if (
			activeContent.value.hasOwnProperty(field as keyof Content) &&
			activeContent.value[field as keyof Content] === ""
		)
			error.value.push(field);
	});

	if (error.value.length) {
		disabledForm.value = false;
		loading.value = false;
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}

	const pushContent: Content = activeContent.value;

	pushContent.app = pushContent.app.toLowerCase();

	if (isNew.value) {
		store
			.addContent(activeContent.value)
			.then((r: ReturnedData | ReturnedError) => {
				returnHandler(r);
			});
	} else {
		store
			.updateContent(activeContent.value)
			.then((r: ReturnedData | ReturnedError) => {
				returnHandler(r);
			});
	}
}

function returnHandler(r: ReturnedData | ReturnedError) {
	if (r.success) {
		router.push({ path: "/content" });
	} else {
		currentError.value = r.error.status;
		setTimeout(() => {
			currentError.value = "";
		}, 2000);
	}
	loading.value = false;
	disabledForm.value = false;
}

async function createNewText(): Promise<void> {
	let hash: string = await getSHA256Hash(Date.now());
	activeContent.value.texts[hash] = {
		text: "",
		image: "",
		media: "",
	};
	opened.value = true;
}

function changeLang(lang: string) {
	activeContent.value.lang = lang;
}

function toggleTexts(): void {
	opened.value = !opened.value;
}

async function confirmDeleteText(textId: string | number): Promise<void> {
	await store.callPopup("Удалить этот текст?").then((r: boolean) => {
		if (r) {
			delete activeContent.value.texts[textId];
		}
	});
}
</script>

<style scoped lang="scss">
@import "../style.scss";

.content-create-edit {
	.form {
		&__container,
		&__texts-top-line {
			display: flex;
			flex-direction: row;
			width: 100%;
		}

		&__texts-top-line {
			margin-top: 2rem;
		}

		&__textarea {
			height: unset;
		}

		.texts {
			width: 100%;
			margin-top: 2rem;

			&__text + .texts__text {
				margin-top: 1rem;
			}

			.text {
				display: grid;
				grid-template: auto / 4fr 1fr;
				gap: 0.5rem 2rem;

				&__top-line {
					display: flex;
					justify-content: space-between;
					align-items: center;
					// margin-bottom: 0.5rem;

					.form__label {
						width: auto;
					}
				}

				&__delete {
					display: flex;
					justify-content: flex-end;
				}

				&__wrapper {
					display: flex;
				}

				&__textarea {
					margin-right: 2rem;
				}
			}
		}

		button {
			margin-left: unset;
		}

		.texts-toggler {
			display: flex;
			justify-content: center;
			align-items: center;

			svg {
				height: 2.3rem;
				width: 2.3rem;
			}

			&__corner {
				width: 2rem !important;
				height: auto !important;
				fill: var(--c__violet);
				transform: rotate(180deg);
				transition: var(--transition-03), opacity 0.3s ease, visibility 0s;
				opacity: 1;
				visibility: visible;
				cursor: pointer;
			}

			&.opened {
				.texts-toggler__corner {
					transform: rotate(0);
				}
			}

			p {
				font-size: 1.5rem;
				margin-right: 1rem;
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.form {
			&__label {
				white-space: nowrap;
				margin-right: 1.5rem;
				margin-bottom: 0;
			}

			.texts {
				.text {
					grid-template: auto/1fr;
					position: relative;
					padding-top: 2.8rem;

					&__file-input {
						box-sizing: border-box;
					}

					&__delete {
						position: absolute;
						top: 0;
						right: 0;
					}
				}
			}
		}
	}
}
</style>