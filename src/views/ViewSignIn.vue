<template>
	<div class="sign-in">
		<div class="sign-in__container">
			<h1 class="sign-in__main-title">
				LEV<span class="sign-in__main-title_colored">DEV</span>YAN
			</h1>
			<form class="sign-in__form form" @submit.prevent="signIn($event)">
				<input
					type="email"
					name="email"
					class="form__input"
					placeholder="Логин"
					v-model="userCreds.email"
				/>
				<div class="form__wrapper">
					<input
						:type="inputType"
						name="password"
						class="form__input_password"
						placeholder="Пароль"
						v-model="userCreds.password"
						spellcheck="false"
					/>
					<p class="form__mask">{{ pass_mask }}</p>
				</div>

				<button class="form__button" type="submit">Войти</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ComputedRef, ref, Ref } from "@vue/reactivity";
import { computed, inject, watch } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { UserCredentials } from "../../helpers";

const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);
const router = useRouter();

const userCreds: Ref<UserCredentials> = ref({
	email: "",
	password: "",
});
const pass: Ref<string> = ref("");
const pass_mask: ComputedRef<string> = computed((): string => {
	return "*".repeat(userCreds.value.password.length);
});
const inputType: string = window.screen.width > 800 ? "text" : "password";

async function signIn(e: Event) {
	const credentials: FormData = new FormData(e.target as HTMLFormElement);
	loading.value = true;
	await store.signIn(credentials).then((r: boolean) => {
		loading.value = false;

		if (r) router.push("/");
	});
}
</script>

<style scoped lang="scss">
@import "../style.scss";

.sign-in {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&__container {
		background-color: var(--c__blue_dark);
		width: 50%;
		max-width: 700px;
		height: auto;
		padding: 3.2rem 4.5rem;
		border-radius: 3.6rem;
	}

	&__main-title {
		font-family: "Philosopher";
		font-size: 2.8rem;
		text-align: center;
		margin-bottom: 3.2rem;
		font-weight: 200;
		color: var(--c__white);

		&_colored {
			font-family: "Philosopher";
			color: var(--c__light-violet);
		}
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: stretch;

		&__wrapper {
			display: flex;
			position: relative;
			background-color: rgba(217, 217, 217, 0.12);
			border: 0.2rem solid var(--c__white);
			border-radius: 1.2rem;
			color: var(--c__white);
			margin-bottom: 4rem;
			padding: 1.2rem 2rem;
		}

		input {
			font: {
				family: var(--f__montserrat-sb);
				size: 1.3rem;
			}

			&::placeholder {
				color: rgba(255, 255, 255, 0.741);
			}
		}

		&__input_password {
			color: transparent;
			caret-color: var(--c__white);
			background-color: transparent;
			border: 0;
			z-index: 1;
			position: absolute;
			top: 50%;
			left: 2rem;
			right: 2rem;
			transform: translateY(-50%);
			letter-spacing: 0.2rem;
			font: {
				family: monospace;
				size: 1.5rem;
			}

			&::selection {
				color: transparent;
				background-color: #0c5fc6;
			}

			&::placeholder {
				letter-spacing: 0;
				font: {
					family: var(--f__montserrat-sb);
					size: 1.3rem;
				}
			}
		}

		&__input {
			background-color: rgba(217, 217, 217, 0.12);
			border: 0.2rem solid var(--c__white);
			border-radius: 1.2rem;
			padding: 1.2rem 2rem;
			color: var(--c__white);
			margin-bottom: 2rem;
		}

		&__mask {
			letter-spacing: 0.2rem;
			z-index: 2;
			height: 1.5rem;
			overflow: hidden;
			pointer-events: none;
			font: {
				family: monospace;
				size: 1.5rem;
			}
		}

		&__button {
			background-color: var(--c__violet);
			border: 0;
			color: var(--c__white);
			border-radius: 1.2rem;
			padding: 1.2rem;
			cursor: pointer;
			font: {
				family: var(--f__montserrat-sb);
				size: 1.6rem;
			}
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		&__container {
			width: 100%;
			max-width: unset;
			height: auto;
			padding: 2.8rem 3.5rem;
			border-radius: 3.6rem;
		}

		.form {
			&__wrapper {
				display: flex;
				position: relative;
				background-color: rgba(217, 217, 217, 0.12);
				border: 0.2rem solid var(--c__white);
				border-radius: 1.2rem;
				color: var(--c__white);
				margin-bottom: 4rem;
				padding: 1.2rem 2rem;
			}

			&__input_password {
				height: 1.5rem;
				width: 100%;
				color: var(--c__white);
				position: relative;
				top: unset;
				left: unset;
				right: unset;
				transform: unset;
				letter-spacing: unset;
				font: {
					family: inherit;
					size: 1.5rem;
				}

				&::selection {
					color: transparent;
					background-color: #0c5fc6;
				}

				&::placeholder {
					letter-spacing: 0;
					font: {
						family: var(--f__montserrat-sb);
						size: 1.3rem;
					}
				}
			}

			&__mask {
				display: none;
			}

			&__button {
				background-color: var(--c__violet);
				border: 0;
				color: var(--c__white);
				border-radius: 1.2rem;
				padding: 1.2rem;
				cursor: pointer;
				font: {
					family: var(--f__montserrat-sb);
					size: 1.6rem;
				}
			}
		}
	}
}
</style>