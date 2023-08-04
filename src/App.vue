<template>
	<TheNavbar v-if="idSignIn" />
	<main class="main" :class="{ 'sign-in': route.path === '/sign-in' }">
		<div class="main__container" :class="{ 'no-scroll': no_scroll }">
			<header class="main__header header" v-if="idSignIn">
				<h2 class="header__title">
					{{ mainTitle || route.meta.title }}
				</h2>
				<div class="header__account account">
					<div class="account__wrapper"></div>
					<div class="account__wrapper">
						<div class="account__image">
							<img src="@images/user_default.png" alt="Account image" />
						</div>
					</div>
				</div>
			</header>
			<RouterView v-slot="{ Component }">
				<Component :is="Component" />
			</RouterView>
		</div>
	</main>
	<MainLoader v-if="loading" />
	<Popup />
	<InfoPopup />
</template>

<script setup lang="ts">
import Popup from "@add-comps/Popup.vue";
import InfoPopup from "@add-comps/InfoPopup.vue";
import TheNavbar from "@comps/TheNavbar.vue";
import MainLoader from "@add-comps/MainLoader.vue";
import { computed, inject, watch } from "@vue/runtime-core";
import { ComputedRef, Ref, ref } from "@vue/reactivity";
import { RouterView, useRoute, useRouter } from "vue-router";
import { StoreGeneric, storeToRefs } from "pinia";
import { StringObject } from "../helpers";

const route = useRoute();
const router = useRouter();
const store = <StoreGeneric>inject("Store");
const { loading, mainTitle, popup, apps, activeApp } = storeToRefs(store);

store.updateTime();
let idSignIn: ComputedRef<boolean> = computed(() => route.path !== "/sign-in");
let no_scroll: ComputedRef<boolean> = computed(
	() => loading.value || popup.value.isActive
);

watch(
	() => no_scroll.value,
	() => {
		no_scroll.value
			? document.body.classList.add("no-scroll")
			: document.body.classList.remove("no-scroll");
	}
);

const isMobile: any = () => {
	return {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Mac: function () {
			return navigator.userAgent.match(/Macintosh|Mac OS/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		isApple: function () {
			return this.iOS() || this.Mac();
		},
		any: function () {
			if (
				this.Android() ||
				this.BlackBerry() ||
				this.iOS() ||
				this.Mac() ||
				this.Opera() ||
				this.Windows()
			) {
				return true;
			}
			return false;
		},
	};
};
if (isMobile().isApple()) document.body.classList.add("apple");

watch(
	() => route.query.app,
	() => {
		if (route.query.app && apps.value[route.query.app as keyof StringObject]) {
			activeApp.value = route.query.app;
		}
	}
);
</script>

<style lang="scss">
@import "@/style.scss";

.main {
	flex-grow: 1;

	&__container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 3rem 3.5rem;
		overflow: auto;
	}

	.header {
		display: flex;
		margin-bottom: 2rem;
		align-items: center;

		&__title {
			flex: 1;

			font: {
				size: 2rem;
				family: "Montserrat";
			}
		}

		.account {
			&__image {
				width: 5rem;
				height: 5rem;
				border-radius: 50%;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		display: flex;

		&.sign-in {
			margin-top: 0;
			display: flex;
			align-items: center;

			.main__container {
				width: 100%;
			}
		}

		margin-top: 6.6rem;

		&__container {
			padding: 2rem 2.5rem;
			overflow-x: hidden;
			height: unset;
		}

		.header {
			&__title {
				font: {
					size: 2.5rem;
				}
			}
		}
	}
}

@media screen and (max-width: $mobile--breakpoint) {
	.iPhone {
		.main {
			.header {
				&__title {
					letter-spacing: -0.1rem;
				}
			}
		}
	}
}
</style>
