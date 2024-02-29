<template>
	<nav class="nav">
		<div class="nav__container">
			<div class="nav__line">
				<RouterLink to="/">
					<h1 class="nav__main-title">
						LEV<span class="nav__main-title_colored">DEV</span>YAN
					</h1>
				</RouterLink>
				<div class="nav__burger burger" @click="toggleBurger" :class="{ active: isActiveBurger }">
					<div class="burger__container">
						<div class="burger__line"></div>
						<div class="burger__line"></div>
						<div class="burger__line"></div>
					</div>
				</div>
			</div>

			<ul class="nav__pages pages" ref="pages" :class="{ open: opened, opening: opening }">
				<li class="pages__page" v-for="(link, j) of links" :key="j" :data-page="activeNavPage === link.name">
					<RouterLink class="pages__link" :to="link.to + (link.variative ? '?app=' + activeApp : '')">
						<div class="pages__icon">
							<component :is="link.nav_icon" />
						</div>
						<p>{{ link.nav_title }}</p>
					</RouterLink>
				</li>
				<li class="pages__page" @click="confirmSignOut" @keypress="confirmSignOut">
					<div class="pages__link">
						<div class="pages__icon sign-out">
							<IconLogout />
						</div>
						<p>Выход</p>
					</div>
				</li>
				<div class="pages__selected-page"></div>
			</ul>
			<img src="@images/Nav__Image.png" alt="" class="nav__image" />
		</div>
	</nav>
</template>

<script setup lang="ts">
import IconLogout from "@icons/IconLogout.vue";
import { useRouter, useRoute, RouteComponent } from "vue-router";
import {
	computed,
	toRefs,
	ComputedRef,
	inject,
	watch,
	Ref,
	ref,
} from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { useCookies } from "vue3-cookies";
import { StringObject, Link } from "../../helpers";
import { String } from "lodash";

const router = useRouter();
const route = useRoute();
const { cookies } = useCookies();

const store = <StoreGeneric>inject("Store");
const { popup, activeApp } = storeToRefs(store);

const links: ReadonlyArray<Link> = router.options.routes
	.filter((r) => {
		return r.meta?.isNav;
	})
	.map((r) => {
		return {
			name: <string>r.name,
			to: <string>r.path,
			nav_icon: <string>(!r.meta ? "" : r.meta.nav_icon),
			nav_title: <string>(!r.meta ? "" : r.meta.nav_title),
			variative: <boolean>(!r.meta ? false : r.meta.variative),
		};
	});

let pageName = toRefs(route).name;
let isActiveBurger: Ref<boolean> = ref(false);
const pages: any = ref(null);
let opened: Ref<boolean> = ref(false);
let opening: Ref<boolean> = ref(false);

let activeNavPage: ComputedRef<string> = computed(() => {
	return pageName.value
		? ((pageName.value as string)?.split(/(?=[A-Z])/))[0]
		: "";
});

async function confirmSignOut() {
	await store.callPopup("Вы уверены, что хотите выйти?").then((r: boolean) => {
		if (r) {
			cookies.remove("session_token");
			router.push("/sign-in");
		}
	});
}

function toggleBurger() {
	isActiveBurger.value = !isActiveBurger.value;
}

watch(
	() => isActiveBurger.value,
	() => {
		if (!pages.value?.classList.contains("open")) {
			pages.value.style.height = pages.value.scrollHeight + "px";
			opening.value = true;
			setTimeout(() => {
				pages.value.style = "";
				opened.value = true;
				opening.value = false;
			}, 300);
		} else {
			pages.value.style.height = pages.value.scrollHeight + "px";
			opened.value = false;
			setTimeout(() => {
				pages.value.style = "";
			}, 0);
		}
	}
);

watch(
	() => route.path,
	() => {
		isActiveBurger.value = false;
	}
);
</script>

<style lang="scss" scoped>
@import "@/style.scss";

.nav {
	background-color: $--c__blue_dark;
	color: $--c__white;
	border-radius: 0 3.125rem 3.125rem 0;
	max-width: 400px;
	width: 18%;
	min-width: 18%;
	padding: 4rem 2.375rem;
	overflow: hidden;

	&__line {
		position: relative;
		margin-bottom: 4.5rem;
	}

	&__container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	&__main-title {
		font: {
			family: "Philosopher";
			size: 3.3rem;
			weight: 200;
		}

		text-align: center;

		&_colored {
			font-family: "Philosopher";
			color: $--c__light-violet;
		}
	}

	$link-height: 2.8rem;

	.pages {
		position: relative;
		margin-bottom: auto;

		&__page {
			display: flex;
			align-items: center;
			cursor: pointer;
			padding: 0 2rem;
			height: $link-height;
			position: relative;

			&+.pages__page {
				margin-top: 2rem;
			}

			p {
				font-size: 1.5rem;
				// line-height: 2rem;
			}

			&::before {
				content: "";
				position: absolute;
				top: 50%;
				left: 0;
				width: 100%;
				height: $link-height + 1rem;
				background-color: $--c__violet;
				border-radius: 1rem;
				z-index: 1;
				transform: translateY(-50%);
				transition: all 0.3s ease;
				opacity: 0;
			}

			&[data-page="true"]::before {
				opacity: 1;
			}
		}

		&__icon {
			width: 2.125rem;
			height: 2.125rem;
			object-fit: cover;
			margin-right: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;

			& * {
				fill: $--c__white !important;
			}

			&.sign-out {
				transform: scale(0.9);
			}
		}

		&__link {
			display: flex;
			align-items: center;
			width: 100%;
			z-index: 2;
		}
	}

	&__image {
		width: 100%;
		height: auto;
		align-self: center;
		transform-origin: 50% 40%;
		transform: scale(0.7);
	}

	.burger {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3.5rem;
		height: 60%;
		cursor: pointer;
		display: none;

		&__container {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			position: relative;
		}

		&__line {
			position: absolute;
			width: 100%;
			height: 18%;
			background-color: $--c__light-violet;
			transition: all 0.5s ease;

			&:nth-child(1) {
				top: 0;
				transform-origin: center center;
			}

			&:nth-child(2) {
				top: 50%;
				transform: translateY(-50%);
			}

			&:nth-child(3) {
				top: 100%;
				transform: translateY(-100%);
			}
		}

		&.active .burger {
			&__line {
				&:nth-child(1) {
					top: 50%;
					transform: translateY(-50%) rotate(45deg);
				}

				&:nth-child(2) {
					width: 0;
				}

				&:nth-child(3) {
					top: 50%;
					transform: translateY(-50%) rotate(-45deg);
				}
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 5;
		max-width: unset;
		width: 100%;
		border-radius: 0;
		padding: 1.8rem;

		&__line {
			margin-bottom: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&__main-title {
			margin-bottom: 0;
			font-size: 2.8rem;
		}

		.pages {
			height: 0;
			transition: var(--transition-03);
			margin-top: 0;
			opacity: 0;
			visibility: hidden;

			&.open,
			&.opening {
				margin-top: 2rem;
				padding-bottom: 1rem;
			}

			&.open {
				height: auto;
				opacity: 1;
				visibility: visible;
			}
		}

		&__image {
			display: none;
		}

		.burger {
			display: flex;
		}
	}
}
</style>