<template>
	<section class="content">
		<div class="content__top-line top-line">
			<ButtonsPages :additionLinksNumber="1">
				<RouterLink class="buttons-pages__link-other" :to="{ query: { app: 'other' } }"
					:class="{ js_active: route.query.app === 'other' }">
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
					<RouterLink class="list__link" :to="{ query: { app: route.query.app, type: contentType } }"
						:class="{ js_active: route.query.type === contentType }">
						{{ contentType.slice(0, 1).toUpperCase() + contentType.slice(1) }}
					</RouterLink>
				</li>
			</ul>
		</div>
		<div class="content__empty" v-if="!Object.keys(contentList).length && !loading">
			<img src="@images/Courses__Empty-Courses.png" alt="" width="281" height="255" />
			<p>Контента еще нет...</p>
		</div>
		<TransitionGroup tag="div" :name="transitionName" v-else>
			<ContentItem v-for="(content, j) in contentList" :key="j" :contentId="(<unknown>j as string)" :content="content"
				@confirm-delete-content="confirmDeleteContent" />
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
import { cloneDeep } from "lodash";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";

const store = <StoreGeneric>inject("Store");
const { contentList, loading, languages } = storeToRefs(store);
const route = useRoute();
const router = useRouter();
const { cookies } = useCookies();

const isEmpty: Ref<boolean> = ref(false);
const popup: Ref<boolean> = ref(false);
const pageName: Ref = toRef(route, "name");
const lang: Ref<string> = ref(cookies.get(`${pageName.value}Lang`));
const transitionName: Ref<string> = ref("list");
const app: ComputedRef<string> = computed(() =>
	route.query.app ? <string>route.query.app : "psy"
);
const contentTypes: Ref<string[]> = ref([]);

getContent()

watch(
	() => route.query.type,
	async () => {
		transitionName.value = "disabled-list";
		await store.getContent(app.value, lang.value, null, route.query.type);
	}
);

watch(
	() => app.value,
	async () => {
		transitionName.value = "disabled-list";

		getContent()
	}
);

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

async function getContent(): Promise<void> {
	await store.getTypes(app.value).then((r: string[]) => {
		contentTypes.value = r

		if (contentTypes.value.length && !route.query.type) {
			router.replace({ query: { app: route.query.app, type: contentTypes.value[0] } })
		}
	})
	store.getContent(app.value, lang.value, null, route.query.type);
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.content {
	flex: 1;
	display: flex;
	flex-direction: column;

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
					background-color: $--c__green;
					border-width: 0;
					color: $--c__white;
				}
			}
		}
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