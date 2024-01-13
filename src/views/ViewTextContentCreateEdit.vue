<template>
	<section class="content-create-edit">
		<form class="content-create-edit__form form" @submit.prevent="contentChangeHandler">
			<InputImage class="form__file-input" :image="image" :name="'content_image'" :currentError="currentError"
				:disabled="disabledForm" @display-image="displayImage($event, 'content_image')" />

			<label for="input_title" class="form__label">Название</label>
			<input id="input_title" type="text" class="form__input" :class="{ _error: error.includes('title') }" name="title"
				:disabled="disabledForm" v-model="activeContent.title" @input="error = clearVariable(error)" />

			<label for="input_app" class="form__label">Приложение</label>
			<input id="input_app" name="app" type="text" list="input_app_datalist" class="form__input"
				:class="{ _error: error.includes('app') }" v-model="activeContent.app" :disabled="disabledForm" />
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
				<select id="input_lang" name="lang" class="form__input" :class="{ _error: error.includes('lang') }"
					v-model="activeContent.lang" :disabled="disabledForm">
					<option v-for="(language, j) in languages" :key="j" :value="j">
						{{ language }}
					</option>
				</select>
			</div>

			<label for="input_type" class="form__label">Тип</label>
			<input id="input_type" type="text" class="form__input" :class="{ _error: error.includes('type') }" name="type"
				:disabled="disabledForm" v-model="activeContent.type" @input="error = clearVariable(error)" />

			<div class="form__texts-top-line justify-space-between">
				<ButtonCreate class="form__button-create" @click.prevent="createNewText">
					Добавить элемент
				</ButtonCreate>

				<div class="form__texts-toggler texts-toggler" :class="{ opened: opened }">
					<p>Элементы ({{ Object.keys(activeContent.texts).length }})</p>
					<IconCorner class="texts-toggler__corner" @click="toggleTexts" />
				</div>
			</div>

			<OpeningList class="form__texts texts" :isOpen="opened">
				<Container @drop="onDrop" class="texts__container" lock-axis="y" drag-handle-selector=".form__label">
					<TransitionGroup name="list">
						<Draggable class="texts__text text" v-for="(j, i) in textsKeys" :key="j">
							<div class="text__top-line">
								<label class="form__label">Элемент {{ textsKeys.length - i }}</label>
								<BlockMedia :text="activeContent.texts[j]" :hash="(j as string)" :currentError="currentError"
									:disabled="disabledForm" @display-media="displayMedia($event, j)" />
								<!-- <InputMedia class="form__media-input" :media="text?.media" :name="'content_media_' + j"
								:currentError="currentError" :disabled="disabledForm" @display-media="displayMedia($event, j)" /> -->
							</div>
							<div class="text__delete">
								<IconTrash class="text__icon icon-trash" @click="confirmDeleteText(j)" />
							</div>
							<div class="text__inputs inputs">
								<input type="text" class="form__input inputs__title" name="title" :disabled="disabledForm"
									v-model="activeContent.texts[j].title" placeholder="Название" />
								<input type="text" class="form__input inputs__author" name="author" :disabled="disabledForm"
									v-model="activeContent.texts[j].author" placeholder="Автор" />
								<textarea class="form__textarea inputs__description" v-model="activeContent.texts[j].text"
									:disabled="disabledForm" placeholder="Описание"></textarea>
								<div class="inputs__premium">
									<p>Премиум</p>
									<Checkbox :defaultChecked="activeContent.texts[j].is_premium ? true : false"
										@changeState="activeContent.texts[j].is_premium = $event" />
								</div>
								<input type="text" class="form__input inputs__type" name="type" :disabled="disabledForm"
									v-model="activeContent.texts[j].type" placeholder="Тип" />
								<input type="text" class="form__input inputs__info" name="info" :disabled="disabledForm"
									v-model="activeContent.texts[j].info" placeholder="Информация" />
							</div>
							<div>
								<InputImage class="text__file-input" :image="activeContent.texts[j].image"
									:name="'content_image_' + j" :currentError="currentError" :disabled="disabledForm"
									@display-image="displayImage($event, j)" />
							</div>
						</Draggable>
					</TransitionGroup>
				</Container>
			</OpeningList>

			<div class="form__container justify-end">
				<ButtonColored type="submit" :disabled="disabledForm" class="form__button">
				</ButtonColored>
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
import BlockMedia from "@add-comps/BlockMedia.vue";
import ButtonCreate from "@add-comps/ButtonCreate.vue";
import Checkbox from "@add-comps/Checkbox.vue";
import { useRoute, useRouter } from "vue-router";
import {
	inject,
	onMounted,
	onUnmounted,
	ref,
	Ref,
	watch,
	ComputedRef,
	computed,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import {
	Content,
	ContentTexts,
	ContentList,
	ReturnedData,
	ReturnedError,
} from "../../helpers";
import { cloneDeep } from "lodash";
// @ts-ignore
import { Container, Draggable } from "vue-dndrop";

const store = <StoreGeneric>inject("Store");
const clearVariable = <Function>inject("clearVariable");
const getSHA256Hash = <Function>inject("getSHA256Hash");
// const reverseObject = <Function>inject("reverseObject");
const {
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
// const page: ComputedRef<string> = computed(() => {
// 	return route.path.split("/")[route.path.split("/").length - 1];
// });
const app: ComputedRef<string> = computed(() =>
	route.params.app ? <string>route.params.app : "psy"
);
const textsKeys: ComputedRef<string[]> = computed((): string[] => Object.keys(activeContent.value.texts).reverse());
const currentError: Ref<string> = ref("");
const error: Ref<Array<string>> = ref([]);
const image: Ref<string> = ref("");
const isNew: Ref<boolean> = ref(true);
const opened: Ref<boolean> = ref(false);
const isImageLoaded: Ref<boolean> = ref(false);
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

// watch(() => activeContent.value,
// 	() => {
// 		console.log(activeContent.value);
// 	},
// 	{
// 		deep: true
// 	}
// )

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

watch(
	() => currentError.value,
	() => {
		switch (currentError.value) {
			case "DUPLICATE_ENTRY":
				error.value.push("title");
				error.value.push("app");
				error.value.push("lang");
				error.value.push("type");
				error.value.push("content_image");
				break;

			default:
				error.value = [];
		}
	}
);

function displayImage(isImage: boolean, id: string | number): void {
	isImageLoaded.value = isImage;
	isImage ? imagesCount.value++ : imagesCount.value--;

	if (!isImage) {
		if (id === "content_image") {
			image.value = "";
		} else {
			activeContent.value.texts[id].image = "";
		}
	}
}

function displayMedia(isMedia: boolean, id: string | number): void {
	if (isMedia) mediaCount.value++
	// isMedia ? mediaCount.value++ : mediaCount.value--;

	if (!isMedia) {
		activeContent.value.texts[id].media = "";
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

	if (mediaCount.value) {
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

	const pushContent: Content = cloneDeep(activeContent.value);

	pushContent.app = pushContent.app.toLowerCase();

	for (const key in pushContent.texts) {
		delete pushContent.texts[key].media_size
		delete pushContent.texts[key].playtime
	}

	if (isNew.value) {
		store
			.addContent(pushContent)
			.then((r: ReturnedData | ReturnedError) => returnHandler(r));
	} else {
		store.updateContent(pushContent).then((r: ReturnedData | ReturnedError) => {
			returnHandler(r);
		});
	}
}

function returnHandler(r: ReturnedData | ReturnedError) {
	if (r.success) {
		router.back()
		router.push({ path: "/content" })
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
	let hash: string = await getSHA256Hash(Date.now() + Math.random() * 10000);
	activeContent.value.texts[hash] = {
		title: "",
		text: "",
		author: "",
		type: "",
		info: "",
		is_premium: 0,
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
	await store.callPopup("Удалить этот элемент?").then((r: boolean) => {
		if (r) {
			delete activeContent.value.texts[textId];
		}
	});
}

function onDrop(dropResult: any): void {
	activeContent.value.texts = applyDrag(activeContent.value.texts, dropResult)
}

const applyDrag = (texts: ContentTexts, dragResult: any): ContentTexts => {
	const { removedIndex, addedIndex }: { removedIndex: number, addedIndex: number } = dragResult;
	if (removedIndex === null && addedIndex === null) return texts;

	const result: ContentTexts = {};

	textsKeys.value.forEach((el: string, key: number): void => {
		if (key > removedIndex && key > addedIndex || key < removedIndex && key < addedIndex) {
			result[el as keyof ContentTexts] = texts[el as keyof ContentTexts];
		}
		else if (key >= removedIndex && key < addedIndex) {
			result[textsKeys.value[key + 1] as keyof ContentTexts] = texts[textsKeys.value[key + 1] as keyof ContentTexts]
		}
		else if (key > addedIndex && key <= removedIndex) {
			result[textsKeys.value[key - 1] as keyof ContentTexts] = texts[textsKeys.value[key - 1] as keyof ContentTexts]
		}
		else if (key === addedIndex) {
			result[textsKeys.value[removedIndex] as keyof ContentTexts] = texts[textsKeys.value[removedIndex] as keyof ContentTexts]
		}
	});

	return <ContentTexts>reverseObject(result);
};

function reverseObject(object: { [key: string | number]: any }): { [key: string | number]: any } {
	console.log(object);

	const keys: Array<string | number> = Object.keys(object).reverse(),
		newObject: { [key: string | number]: any } = {}
	keys.forEach((el: string | number): void => {
		newObject[el] = cloneDeep(object[el])
	})
	console.log(newObject);
	return newObject
};
</script>

<style scoped lang="scss">
@import "@/style.scss";

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

			&__container {}

			&__text+.texts__text {
				margin-top: 2.5rem;
			}

			.text {
				display: grid;
				grid-template: auto / 4fr 1fr;
				gap: 0.5rem 2rem;
				position: relative;

				&__top-line {
					display: flex;
					justify-content: space-between;
					align-items: center;
					// margin-bottom: 0.5rem;

					.form__label {
						width: auto;
						cursor: move;
					}
				}

				&__delete {
					display: flex;
					justify-content: flex-end;
				}

				&__wrapper {
					display: flex;
				}

				&__description {
					margin-right: 2rem;
				}

				.inputs {
					display: grid;
					grid-template: auto / repeat(16, 1fr);
					gap: 1.2rem;

					&>* {
						margin: 0 !important;
					}

					&__title,
					&__author,
					&__info {
						grid-column: span 8;
					}

					&__description {
						grid-column: span 16;
					}

					&__premium {
						display: flex;
						align-items: center;
						grid-column: span 2;

						p {
							font-size: 1.4rem;
						}
					}

					&__type {
						grid-column: span 6;
					}

				}

				&::before {
					content: "";
					position: absolute;
					width: calc(100% + 1.6rem);
					height: calc(100% + 1.6rem);
					top: -0.8rem;
					left: -0.8rem;
					background-color: $--c__white;
					z-index: -1;
					box-shadow: 0px 0px 10px 0px $--c__grey;
					border-radius: 0.5rem;
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
				fill: $--c__violet;
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

					.inputs {
						display: grid;
						grid-template: auto / repeat(16, 1fr);
						gap: 1.2rem;

						&__title,
						&__author,
						&__info,
						&__description {
							grid-column: span 16;
						}

						&__premium,
						&__type {
							grid-column: span 8;
						}
					}
				}
			}
		}
	}
}
</style>