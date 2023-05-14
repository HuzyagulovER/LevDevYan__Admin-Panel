<template>
	<section class="content">
		<div class="content__top-line top-line">
			<ButtonsPages />

			<ButtonCreate
				to="/content/create-edit/new"
				class="top-line__button-create"
			>
				Создать контент
			</ButtonCreate>
		</div>
		<LanguageChoice @return-lang="changeLang" :isCookie="true" />
		<div class="content__empty" v-if="isEmpty && !loading">
			<img
				src="@images/Courses__Empty-Courses.png"
				alt=""
				width="281"
				height="255"
			/>
			<p>Контента еще нет...</p>
		</div>
		<TransitionGroup tag="div" :name="transitionName" v-else>
			<ContentItem
				v-for="(content, j) in contentList"
				:key="j"
				:contentId="j"
				:content="content"
				@confirm-delete-content="confirmDeleteContent"
			/>
		</TransitionGroup>
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
import { Content, ContentList } from "../../helpers";
import { cloneDeep } from "lodash";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";

const store = <StoreGeneric>inject("Store");
const { contentList, loading, languages } = storeToRefs(store);
const route = useRoute();
const { cookies } = useCookies();

const isEmpty: Ref<boolean> = ref(false);
const popup: Ref<boolean> = ref(false);
const pageName: Ref = toRef(route, "name");
const lang: Ref<string> = ref(cookies.get(`${pageName.value}Lang`));
const transitionName: Ref<string> = ref("list");
const app: ComputedRef<string> = computed(() =>
	route.query.app ? <string>route.query.app : "psy"
);

store.getContent(app.value, lang.value);

watch(
	() => app.value,
	() => {
		transitionName.value = "disabled-list";
		store.getContent(app.value, lang.value);
	}
);

function changeLang(newLang: string) {
	lang.value = newLang;
	store.getContent(app.value, lang.value);
}

async function confirmDeleteContent(contentId: string): Promise<void> {
	await store.callPopup("Удалить этот контент?").then((r: boolean) => {
		if (r) {
			store.deleteContent([contentId]).then(() => {
				store.getContent(lang.value);
			});
		}
	});
}
</script>

<style scoped lang="scss">
@import "../style.scss";

.content {
	flex: 1;
	display: flex;
	flex-direction: column;

	.top-line {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
		height: 3.3rem;

		& > * {
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
			transform: translateX(4rem);
		}

		p {
			margin-top: -2rem;
			font: {
				size: 1.9rem;
				weight: bold;
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		.top-line {
			display: grid;
			grid-template: 1fr 1fr / repeat(6, 1fr);
			gap: 1.5rem 2.5rem;
			height: auto;

			.buttons-pages {
				grid-column: 1/7;
				display: grid;
				grid-template: 1fr / 1fr 1fr;
				column-gap: 2.5rem;

				& > * {
					margin: 0;
				}
			}

			&__button-create {
				width: 100%;
				grid-column: 2/6;
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