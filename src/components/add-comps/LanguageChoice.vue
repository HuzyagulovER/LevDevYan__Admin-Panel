<template>
	<div class="lang-choice" :class="{ _active: activeDropdown }">
		<div class="lang-choice__container">
			<div class="lang-choice__active-lang">
				<p class="lang-choice__text">{{ languages[activeLang] }}</p>
				<img class="lang-choice__arrow" src="@images/Down-arrow.svg" @click="activeDropdown = !activeDropdown" />
			</div>
			<div class="lang-choice__drop-down drop-down">
				<div class="drop-down__item" v-for="(language, j) in languages" :key="j" @click="returnLang(j)">
					<p class="drop-down__text">{{ language }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { StoreGeneric, storeToRefs } from "pinia";
import { inject, Ref, ref, toRef, toRefs, watch } from "vue";
import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";

const emit = defineEmits(["returnLang"]);
const { cookies } = useCookies();
const route = useRoute();

const props = defineProps<{
	isCookie?: boolean;
	defaultLang?: string;
}>();
const store = <StoreGeneric>inject("Store");
const { languages } = storeToRefs(store);
let activeLang: Ref<string> = ref("");
let activeDropdown: Ref<boolean> = ref(false);
let pageName: Ref = toRef(route, "name");

if (props.isCookie) {
	let lang = cookies.get(`${pageName.value}Lang`);

	if (activeLang.value === "") {
		if (!lang || !languages.value[lang]) {
			cookies.set(`${pageName.value}Lang`, Object.keys(languages.value)[0]);
		}
		activeLang.value = cookies.get(`${pageName.value}Lang`);
	}

	watch(
		() => activeLang.value,
		() => {
			cookies.set(`${pageName.value}Lang`, activeLang.value);
		}
	);
}

watch(
	() => props.defaultLang,
	() => {
		if (props.defaultLang) activeLang.value = props.defaultLang;
	}
);

function returnLang(langId: string | number) {
	activeLang.value = <string>langId;
	activeDropdown.value = !activeDropdown.value;
	emit("returnLang", langId);
}
</script>

<style lang="scss">
@import "@/style.scss";

.lang-choice {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 1.5rem;
	font-size: 1.5rem;
	z-index: 1;

	&__container {
		display: flex;
		position: relative;
		padding: 0.7rem 1.1rem 0.7rem 1rem;
		align-items: center;
	}

	&__active-lang {
		display: flex;
	}

	&__text {
		margin-right: 1.3rem;
	}

	&__arrow {
		width: 1.5rem;
		height: auto;
		object-fit: contain;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.drop-down {
		position: absolute;
		height: 0;
		top: 100%;
		right: 1rem;
		overflow: hidden;
		background-color: $--c__white;
		border-radius: 0.5rem;
		border: 0.1rem solid $--c__grey;
		opacity: 0;

		&__item {
			padding: 0.7rem 1.8rem;
			cursor: pointer;

			&:hover {
				background-color: $--c__light-blue;
			}

			&:active {
				background-color: $--c__light-violet;
			}
		}

		&__text {
			text-align: right;
		}
	}

	&._active {
		.drop-down {
			height: auto;
			opacity: 1;
		}

		.lang-choice__arrow {
			transform: rotate(180deg);
		}
	}
}
</style>