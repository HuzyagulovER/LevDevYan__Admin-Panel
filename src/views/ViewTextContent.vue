<template>
	<section class="content">
		<div class="content__top-line top-line">
			<ButtonsPages :additionLinksNumber="1">
				<RouterLink class="buttons-pages__link-other" :to="{ query: { app: 'other' } }"
					:class="{ js_active: app === 'other' }">
					Другое
				</RouterLink>
			</ButtonsPages>

			<ButtonCreate to="/content/create-edit/new" class="top-line__button-create">
				Создать контент
			</ButtonCreate>
		</div>
		<LanguageChoice @return-lang="changeLang" :isCookie="true" />
		<div class="content__types types">
			<ul class="types__list list">
				<li v-for="contentType in contentTypes">
					<RouterLink class="list__link" :to="{ query: { app: app, type: contentType } }"
						:class="{ js_active: type === contentType, hidden: hidden }">
						{{ contentType.slice(0, 1).toUpperCase() + contentType.slice(1) }}
					</RouterLink>
				</li>
			</ul>
		</div>
		<div class="content__empty" v-if="!Object.keys(contentList).length && !loading">
			<img src="@images/Courses__Empty-Courses.png" alt="" width="281" height="255" />
			<p>Контента еще нет...</p>
		</div>
		<Container @drop="onDrop" class="content__container" lock-axis="y" drag-handle-selector=".content__drag-handle"
			v-else>
			<TransitionGroup :name="transitionName">
				<Draggable v-for="(content, j) in contentList" :key="j" class="content__draggable">
					<ContentItem :contentId="(<unknown>j as string)" :content="content"
						@confirm-delete-content="confirmDeleteContent" :class="{ hidden: hidden }" />
					<div class="content__drag-handle" :class="{ hidden: hidden }">☰</div>
				</Draggable>
			</TransitionGroup>
		</Container>
	</section>
</template>

<script setup lang="ts">
import ContentItem from "@for-content/ContentItem.vue";
import ButtonCreate from "@/components/add-comps/ButtonCreate.vue";
import ButtonsPages from "@/components/add-comps/ButtonsPages.vue";
import LanguageChoice from "@add-comps/LanguageChoice.vue";
import {
	inject,
	Ref,
	ref,
	toRef,
	watch,
	ComputedRef,
	computed,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import { ContentList } from "../../helpers";
import { cloneDeep } from "lodash";
// @ts-ignore
import { Container, Draggable } from "vue-dndrop";

const store = <StoreGeneric>inject("Store");
const { contentList, loading } = storeToRefs(store);
const route = useRoute();
const router = useRouter();
const { cookies } = useCookies();

const contentKeys: ComputedRef<string[]> = computed(() => Object.keys(<ContentList>contentList.value))
const pageName: Ref = toRef(route, "name");
const lang: Ref<string> = ref(cookies.get(`${pageName.value}Lang`));
const transitionName: Ref<string> = ref("list");
const app: ComputedRef<string> = computed(() =>
	route.query.app ? <string>route.query.app : "psy"
)
// const type: Ref<string> = ref('');
const type: ComputedRef<string> = computed(() =>
	route.query.type ? <string>route.query.type : contentTypes.value[0]
);
const contentTypes: Ref<string[]> = ref([]);
const hidden: Ref<boolean> = ref(false)

getTypes().then(() => {
	getContent()
})

watch(
	() => type.value,
	() => {
		transitionName.value = "disabled-list";
		getContent()
	}
);

watch(
	() => app.value,
	() => {
		transitionName.value = "disabled-list";

		if (route.name === "Content") {
			hidden.value = true
			getTypes().then(() => hidden.value = false)
		}
	}
);

async function getContent(): Promise<void> {
	console.log(contentList.value);
	contentList.value = {}
	store.getContent(app.value, lang.value, null, type.value)
}

async function getTypes(): Promise<string[]> {
	return await store.getTypes(app.value).then((r: string[]): string[] => {
		contentTypes.value = r
		return r
	})
}

async function changeLang(newLang: string) {
	lang.value = newLang;
	getContent()
}

async function confirmDeleteContent(contentId: string): Promise<void> {
	await store.callPopup("Удалить этот контент?").then((r: boolean) => {
		if (r) {
			store.deleteContent([contentId]).then(() => {
				store.getContent(app.value, lang.value);
			});
		}
	});
}

async function onDrop(dropResult: any): Promise<void> {
	const { removedIndex, addedIndex }: { removedIndex: number, addedIndex: number } = dropResult;
	const oldContentKeysOrder: string[] = cloneDeep(contentKeys.value)
	contentList.value = applyDrag(contentList.value, dropResult)

	loading.value = true
	await store.updateContentOrder(
		oldContentKeysOrder.slice(
			Math.min(removedIndex, addedIndex),
			Math.max(removedIndex, addedIndex) + 1
		),
		Object.keys(contentList.value).slice(
			Math.min(removedIndex, addedIndex),
			Math.max(removedIndex, addedIndex) + 1
		)
	).then(async (): Promise<void> => {
		await getContent()
		loading.value = false
	})

}

const applyDrag = (contentList: ContentList, dragResult: any): ContentList => {
	const { removedIndex, addedIndex }: { removedIndex: number, addedIndex: number } = dragResult;
	if (removedIndex === null && addedIndex === null) return contentList;

	const result: ContentList = {};

	contentKeys.value.forEach((el: string, key: number): void => {
		if (key > removedIndex && key > addedIndex || key < removedIndex && key < addedIndex) {
			result[el as keyof ContentList] = contentList[el as keyof ContentList];
		}
		else if (key >= removedIndex && key < addedIndex) {
			result[contentKeys.value[key + 1] as keyof ContentList] = contentList[contentKeys.value[key + 1] as keyof ContentList]
		}
		else if (key > addedIndex && key <= removedIndex) {
			result[contentKeys.value[key - 1] as keyof ContentList] = contentList[contentKeys.value[key - 1] as keyof ContentList]
		}
		else if (key === addedIndex) {
			result[contentKeys.value[removedIndex] as keyof ContentList] = contentList[contentKeys.value[removedIndex] as keyof ContentList]
		}
	});
	return result
};
</script>

<style scoped lang="scss">
@import "@/style.scss";

.content {
	flex: 1;
	display: flex;
	flex-direction: column;

	.hidden {
		visibility: hidden;
	}

	.top-line {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
		height: 3.3rem;

		&>* {
			height: 100%;
		}

		&__button-create {
			margin-left: auto;
		}
	}

	&__empty {
		width: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		img {
			width: 20rem;
			height: auto;
			transform: translateX(3rem);
			margin-bottom: 2rem;
		}

		p {
			margin-top: -2rem;

			font: {
				size: 1.9rem;
				weight: bold;
			}
		}
	}

	.types {
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;

		.list {
			list-style: none;

			li {
				display: inline-block;
				margin: 0 1rem 1rem 0;
			}

			&__link {
				border-radius: 0.7rem;
				border: 0.2rem solid $--c__grey;
				font-size: 1.2rem;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.4rem 2rem;

				&.js_active {
					background-color: $--c__dark-green;
					border-width: 0;
					color: $--c__white;
				}
			}
		}
	}

	&__draggable {
		position: relative;

		&+& {
			margin-top: 1.7rem;
		}
	}

	&__drag-handle {
		position: absolute;
		top: 2.3rem;
		left: 2.3rem;
		transform: translate(-50%, -50%);
		color: $--c__violet;
		font-weight: bold;
		cursor: move;
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.top-line {
			display: grid;
			grid-template: 1fr auto / repeat(6, 1fr);
			gap: 1.5rem 2.5rem;
			height: auto;

			&__button-create {
				width: 100%;
				grid-column: 2/6;
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		}

		.types {
			overflow: auto;

			.list {
				display: flex;
				list-style: none;

				li {
					display: inline-block;
				}
			}
		}

		&__button-create {
			padding: 1rem 2rem;
			line-height: 1.8rem;
			font-size: 1.8rem;
		}
	}
}
</style>