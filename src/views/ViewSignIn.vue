<template>
	<div class="sign-in">
		<div class="sign-in__container">
			<h1 class="sign-in__main-title">
				LEV<span class="sign-in__main-title_colored">DEV</span>YAN
			</h1>
			<form class="sign-in__form form" @submit.prevent="signIn($event)">
				<input type="email" name="email" class="form__input" :class="{
					_error:
						returnedErrorStatus === 'INVALID_EMAIL' ||
						error.includes('email'),
				}" placeholder="Логин" v-model="userCreds.email" />
				<div class="form__wrapper" :class="{
					_error:
						returnedErrorStatus === 'INVALID_PASSWORD' ||
						error.includes('password'),
				}">
					<input :type="inputType" name="password" class="form__input_password" placeholder="Пароль"
						v-model="userCreds.password" spellcheck="false" />
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
import { useCookies } from "vue3-cookies";
import { UserCredentials, ReturnedData, ReturnedError } from "../../helpers";

const store = <StoreGeneric>inject("Store");
const { loading } = storeToRefs(store);
const router = useRouter();
const clearVariable = <Function>inject("clearVariable");
const { cookies } = useCookies();

const userCreds: Ref<UserCredentials> = ref({
	email: "",
	password: "",
});
const pass: Ref<string> = ref("");
const pass_mask: ComputedRef<string> = computed((): string => {
	return "*".repeat(userCreds.value.password.length);
});
const inputType: string = window.screen.width > 800 ? "text" : "password";
let returnedErrorStatus: Ref<string> = ref("");
let error: Ref<Array<string>> = ref([]);

async function signIn(e: Event) {
	for (let key in userCreds.value) {
		if (userCreds.value[key as keyof UserCredentials] === "")
			error.value.push(key);
	}

	if (error.value.length) {
		setTimeout(() => {
			error.value = clearVariable(error.value);
		}, 2000);
		return;
	}

	const credentials: FormData = new FormData(e.target as HTMLFormElement);
	loading.value = true;
	await store.signIn(credentials).then((r: ReturnedData | ReturnedError) => {
		loading.value = false;

		if (!r.success) {
			returnedErrorStatus.value = r.error.status;
			setTimeout(() => {
				returnedErrorStatus.value = "";
			}, 2000);
			return;
		}
		cookies.set("session_token", r.data.session_token);
		router.push("/");
	});
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.sign-in {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&__container {
		background-color: $--c__blue_dark;
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
		color: $--c__white;

		&_colored {
			font-family: "Philosopher";
			color: $--c__light-violet;
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
			border: 0.2rem solid $--c__white;
			border-radius: 1.2rem;
			color: $--c__white;
			margin-bottom: 4rem;
			padding: 1.2rem 2rem;
		}

		input {
			height: auto !important;

			font: {
				family: var(--f__montserrat-sb);
				size: 1.3rem;
			}

			&:-webkit-autofill,
			&:-webkit-autofill:hover,
			&:-webkit-autofill:focus {
				-webkit-text-fill-color: $--c__white;
				-webkit-box-shadow: 0 0 0 5rem rgb(73, 78, 101) inset;
			}

			&::placeholder {
				color: rgba(255, 255, 255, 0.741);
			}
		}

		&__input_password {
			color: transparent !important;
			caret-color: $--c__white !important;
			background-color: transparent !important;
			letter-spacing: 0.2rem !important;
			border: 0 !important;
			z-index: 1;
			position: absolute;
			top: 50%;
			left: 2rem;
			right: 2rem;
			transform: translateY(-50%);

			font: {
				family: monospace !important;
				size: 1.5rem !important;
			}

			&:-webkit-autofill,
			&:-webkit-autofill:hover,
			&:-webkit-autofill:focus {
				-webkit-text-fill-color: transparent !important;
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
			border: 0.2rem solid $--c__white;
			border-radius: 1.2rem;
			padding: 1.2rem 2rem;
			color: $--c__white;
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
			background-color: $--c__violet;
			border: 0;
			color: $--c__white;
			border-radius: 1.2rem;
			padding: 1.2rem;
			cursor: pointer;
			margin-left: 0;

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
				border: 0.2rem solid $--c__white;
				border-radius: 1.2rem;
				color: $--c__white;
				margin-bottom: 4rem;
				padding: 1.2rem 2rem;
			}

			&__input_password {
				height: 1.5rem;
				width: 100%;
				color: $--c__white !important;
				position: relative;
				top: unset;
				left: unset;
				right: unset;
				transform: unset;
				letter-spacing: unset;

				font: {
					family: inherit !important;
					size: 1.5rem !important;
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
				background-color: $--c__violet;
				border: 0;
				color: $--c__white;
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