<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="popup-search-user" v-if="popup.isActive && popup.type === 'search_user'">
				<div class="popup-search-user__container">
					<p class="popup-search-user__text">Поиск пользователя</p>
					<div class="popup-search-user__input">
						<label for="user_creds" class="form__label">Почта или ID</label>
						<input id="user_creds" type="text" ref="user_creds" class="form__input" :class="{
							_err: popup.additionFields.error === 'INVALID_ARGUMENT',
						}" />
					</div>
					<div class="popup-search-user__wrapper">
						<button class="popup-search-user__button" tabindex="1" @click="confirm(false)">
							Отмена
						</button>
						<button class="popup-search-user__button" tabindex="1" @click="confirm(true)">
							Поиск
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { merge } from "lodash";
import { StoreGeneric, storeToRefs } from "pinia";

const store = <StoreGeneric>inject("Store");
const { popup } = storeToRefs(store);

let disabled: Ref<boolean> = ref(false);
let user_creds: Ref<HTMLInputElement | null> = ref(null);

function confirm(ans: boolean) {
	if (!disabled.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;
		popup.value.additionFields = merge(popup.value.additionFields, {
			user_creds: (user_creds.value as HTMLInputElement).value,
		});
		setTimeout(() => {
			disabled.value = false;
		}, 500);
	}

	if (!ans) {
		store.clearPopup();
	}
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.popup-search-user {
	position: absolute;
	z-index: 9;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 5rem 0 $--c__grey;
	border-radius: 2rem;
	background-color: $--c__white;
	padding: 2rem;

	&__container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem 4rem;
		position: relative;
	}

	&__text {
		margin-bottom: 3rem;
		text-align: center;

		font: {
			family: var(--f__montserrat-sb);
			size: 2rem;
		}
	}

	&__input {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 3rem;

		font: {
			family: var(--f__montserrat-sb);
		}

		input {
			&._err {
				border-color: $input-error-color;
			}
		}
	}

	&__wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	&__button {
		background-color: $--c__white;
		border: 0.25rem solid $--c__light-violet;
		padding: 0.6rem 5rem;
		border-radius: 0.8rem;
		transition: var(--transition-03);
		cursor: pointer;

		font: {
			family: var(--f__montserrat-sb);
			size: 1.5rem;
		}

		&+& {
			margin-left: 4rem;
		}

		&:focus,
		&:hover {
			background-color: $--c__violet;
			border-color: $--c__violet;
			color: $--c__white;
		}
	}

	&__close {
		position: absolute;
		top: 0;
		right: 0;
		width: 3rem;
		height: 3rem;
		cursor: pointer;

		svg {
			width: 100%;
			height: 100%;
			fill: $--c__violet;
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		position: fixed;
		width: 90%;
		padding: 2rem 0;

		&__input {
			.form__label {
				font: {
					size: 1.8rem;
				}
			}
		}

		&__button {
			padding: 0.6rem 4rem;

			font: {
				size: 1.2rem;
			}
		}
	}
}
</style>