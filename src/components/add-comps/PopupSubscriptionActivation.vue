<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="popup-user-add-sub" v-if="popup.isActive && popup.type === 'add_subscription'">
				<div class="popup-user-add-sub__container">
					<p class="popup-user-add-sub__text">Включение подписки</p>
					<div class="popup-user-add-sub__input">
						<label for="user_creds" class="form__label">Почта или ID</label>
						<input id="user_creds" type="text" v-model="user_creds" class="form__input" :class="{
							_err: popup.additionFields.error === 'INVALID_ARGUMENT',
						}" :disabled="disabled" />
					</div>
					<div class="popup-user-add-sub__input">
						<label for="user_creds" class="form__label">Приложение</label>
						<select id="sub_app" class="form__input" v-model="sub_app" :disabled="disabled">
							<option v-for="sub in apps" :value="sub.toLowerCase()" :key="sub">
								{{ sub }}
							</option>
						</select>
					</div>
					<div class="popup-user-add-sub__input">
						<label for="user_creds" class="form__label">Тип подписки</label>
						<select id="sub_name" class="form__input" v-model="sub_type">
							<option value="">Без изменений {{ currentsSubName ? "(" + currentsSubName + ")" : '' }}</option>
							<option value="none">
								Отключить
							</option>
							<option v-for="_type in popup.additionFields.prices[sub_app]" :value="_type.id" :key="_type.id">
								{{ _type.name }}
							</option>
						</select>
					</div>
					<div class="popup-user-add-sub__input" v-if="popup.additionFields.autopayment && sub_type === ''">
						<label for="user_creds" class="form__label">Автооплата</label>
						<select id="sub_name" class="form__input" v-model="sub_autopayment">
							<option value="1">
								Включить
							</option>
							<option value="0">
								Отключить
							</option>
						</select>
					</div>
					<div class="popup-user-add-sub__wrapper">
						<button class="popup-user-add-sub__button" tabindex="1" @click="confirm(true)">
							Сохранить
						</button>
						<button class="popup-user-add-sub__button" tabindex="1" @click="confirm(false)">
							Отмена
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { merge } from "lodash";
import { StoreGeneric, storeToRefs } from "pinia";

const store = <StoreGeneric>inject("Store");
const { popup, apps } = storeToRefs(store);

const disabled: Ref<boolean> = ref(false);
const disable: Ref<boolean> = ref(false);
const user_creds: Ref<string> = ref("");
const sub_app: Ref<string> = ref("");
const sub_type: Ref<string> = ref("");
const sub_autopayment: Ref<string> = ref("");
const currentsSubName: Ref<string> = ref("")

watch(
	() => popup.value,
	() => {
		if (popup.value.additionFields.app) {
			sub_app.value = popup.value.additionFields.app
		}
		if (popup.value.additionFields.creds) {
			user_creds.value = popup.value.additionFields.creds
		}
		if (sub_app.value && user_creds.value) {
			sub_autopayment.value = popup.value.additionFields.autopayment
			disabled.value = true
			let typePremium = popup.value.additionFields.subs[sub_app.value].typePremium
			currentsSubName.value = popup.value.additionFields.prices[sub_app.value][typePremium]?.name
		}
	},
	{ deep: true }
)

watch(() => sub_type.value,
	() => {
		console.log(popup.value.additionFields);
		console.log(sub_type.value);
		console.log("");

		sub_autopayment.value =
			(sub_type.value === "")
				? popup.value.additionFields.autopayment
				: ''
	})

function confirm(ans: boolean): void {
	if (!disable.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;

		popup.value.additionFields = merge(popup.value.additionFields, {
			creds: user_creds.value,
			app: sub_app.value,
			type: sub_type.value,
			autopayment: sub_autopayment.value
		});
		setTimeout(() => {
			disabled.value = false;

			user_creds.value = '';
			sub_app.value = "";
			sub_type.value = "";
			sub_autopayment.value = ""
		}, 1000);
	}

	if (!ans) {
		store.clearPopup();
	}
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.popup-user-add-sub {
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