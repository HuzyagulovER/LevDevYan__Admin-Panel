<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="popup-toggle-notifications" v-if="popup.isActive && popup.type === 'toggle_notifications'">
				<div class="popup-toggle-notifications__container">
					<p class="popup-toggle-notifications__text">Уведомления</p>
					<div class="popup-toggle-notifications__input">
						<select id="sub_name" class="form__input" v-model="sys_notifications">
							<option value="1">
								Включены
							</option>
							<option value="0">
								Отключены
							</option>
						</select>
					</div>
					<div class="popup-toggle-notifications__wrapper">
						<button class="popup-toggle-notifications__button" tabindex="1" @click="confirm(false)">
							Отмена
						</button>
						<button class="popup-toggle-notifications__button" tabindex="1" @click="confirm(true)">
							Сохранить
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
const sys_notifications: Ref<string> = ref("");

watch(
	() => popup.value,
	() => {
		if (popup.value.additionFields.creds) {
			user_creds.value = popup.value.additionFields.creds
		}
		sys_notifications.value = popup.value.additionFields.sys_notifications
	},
	{ deep: true }
)

function confirm(ans: boolean): void {
	if (!disable.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;
		popup.value.additionFields = merge(popup.value.additionFields, {
			creds: user_creds.value,
			sys_notifications: sys_notifications.value
		});
		setTimeout(() => {
			disabled.value = false;

			user_creds.value = '';
			sys_notifications.value = ""
		}, 1000);
	}

	if (!ans) {
		store.clearPopup();
	}
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.popup-toggle-notifications {
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