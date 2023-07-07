<template>
	<Teleport to="body">
		<Transition name="list">
			<div
				class="popup-user-add-sub"
				v-if="popup.isActive && popup.type === 'add_subscription'"
			>
				<div class="popup-user-add-sub__container">
					<p class="popup-user-add-sub__text">Включение подписки</p>
					<div class="popup-user-add-sub__input">
						<label for="user_creds" class="form__label">Почта или ID</label>
						<input
							id="user_creds"
							type="text"
							ref="user_creds"
							class="form__input"
							:class="{
								_err: popup.additionFields.error === 'INVALID_ARGUMENT',
							}"
						/>
					</div>
					<div class="popup-user-add-sub__input">
						<label for="user_creds" class="form__label">Приложение</label>
						<select id="sub_app" class="form__input" v-model="sub_app">
							<option v-for="sub in apps" :value="sub.toLowerCase()" :key="sub">
								{{ sub }}
							</option>
						</select>
					</div>
					<div class="popup-user-add-sub__input">
						<label for="user_creds" class="form__label">Тип подписки</label>
						<select id="sub_name" class="form__input" v-model="sub_type">
							<option
								v-for="type in popup.additionFields.prices[sub_app]"
								:value="type.id"
								:key="type.id"
							>
								{{ type.name }}
							</option>
						</select>
					</div>
					<div class="popup-user-add-sub__wrapper">
						<button
							class="popup-user-add-sub__button"
							tabindex="1"
							@click="confirm(true)"
						>
							Включить
						</button>
						<button
							class="popup-user-add-sub__button"
							tabindex="1"
							@click="confirm(false)"
						>
							Отмена
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import IconClose from "@icons/IconClose.vue";
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { merge } from "lodash";
import { StoreGeneric, storeToRefs } from "pinia";

const store = <StoreGeneric>inject("Store");
const { popup, apps } = storeToRefs(store);

let disabled: Ref<boolean> = ref(false);
let user_creds: Ref<HTMLInputElement | null> = ref(null);
let sub_app: Ref<string> = ref("");
let sub_type: Ref<string> = ref("");

function confirm(ans: boolean) {
	if (!disabled.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;
		popup.value.additionFields = merge(popup.value.additionFields, {
			user_creds: (user_creds.value as HTMLInputElement).value,
			sub_app: sub_app.value,
			sub_type: sub_type.value,
		});
		setTimeout(() => {
			disabled.value = false;

			user_creds.value = null;
			sub_app.value = "";
			sub_type.value = "";
		}, 500);
	}

	if (!ans) {
		store.clearPopup();
	}
}
</script>

<style scoped lang="scss">
@import "../../style.scss";
.popup-user-add-sub {
	position: absolute;
	z-index: 9;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 5rem 0 var(--c__grey);
	border-radius: 2rem;
	background-color: var(--c__white);
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
			size: 2rem;
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
		background-color: var(--c__white);
		border: 0.25rem solid var(--c__light-violet);
		padding: 0.6rem 5rem;
		border-radius: 0.8rem;
		transition: var(--transition-03);
		cursor: pointer;

		font: {
			family: var(--f__montserrat-sb);
			size: 1.5rem;
		}

		& + & {
			margin-left: 4rem;
		}

		&:focus,
		&:hover {
			background-color: var(--c__violet);
			border-color: var(--c__violet);
			color: var(--c__white);
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
			fill: var(--c__violet);
		}
	}

	@media screen and (max-width: $mobile--breakpoint) {
		position: fixed;
		width: 90%;
	}
}
</style>