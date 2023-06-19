<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="popup-user-delete" v-if="popup.isActive">
				<IconClose @click="confirm(false)" />
				<div class="popup-user-delete__container">
					<p class="popup-user-delete__text">Удаление пользователя</p>
					<div class="popup-user-delete__input">
						<label for="user_id" class="form__label">Почта или ID</label>
						<input id="user_id" type="text" ref="user_id" class="form__input" />
					</div>
					<div class="popup-user-delete__wrapper">
						<button
							class="popup-user-delete__button"
							tabindex="1"
							@click="confirm(true)"
						>
							Удалить
						</button>
						<button
							class="popup-user-delete__button"
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
import IconTrash from "@icons/IconTrash.vue";
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { merge } from "lodash";
import { StoreGeneric, storeToRefs } from "pinia";

const store = <StoreGeneric>inject("Store");
const { popup } = storeToRefs(store);

let disabled: Ref<boolean> = ref(false);
let user_id: Ref<HTMLInputElement | null> = ref(null);

function confirm(ans: boolean) {
	if (!disabled.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;
		popup.value.isActive = false;
		popup.value.additionFields = merge(popup.value.additionFields, {
			user_id: (user_id.value as HTMLInputElement).value,
		});
		setTimeout(() => {
			store.clearPopup();
			disabled.value = false;
		}, 500);
	}
}
</script>

<style scoped lang="scss">
@import "../../style.scss";
.popup-user-delete {
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