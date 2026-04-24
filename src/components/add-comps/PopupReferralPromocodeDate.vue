<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="popup-referral-promocode-date" v-if="popup.isActive && popup.type === 'referral-promocode-date'">
				<div class="popup-referral-promocode-date__container">
					<p class="popup-referral-promocode-date__text">Выберите даты</p>
					<div class="popup-referral-promocode-date__input">
            <input id="input_date"
                   type="date"
                   class="form__input"
                   name="dateFrom"
                   v-model="dateFrom"/>
            <input id="input_date"
                   type="date"
                   class="form__input"
                   name="dateTo"
                   v-model="dateTo"/>
					</div>
					<div class="popup-referral-promocode-date__wrapper">
						<button class="popup-referral-promocode-date__button" tabindex="1" @click="confirm(false)">
							Отмена
						</button>
						<button class="popup-referral-promocode-date__button" tabindex="1" @click="confirm(true)">
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

const disabled: Ref<boolean> = ref(false);
const disable: Ref<boolean> = ref(false);
const dateFrom: Ref<string> = ref("");
const dateTo: Ref<string> = ref("");

function confirm(ans: boolean): void {
	if (!disable.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;
		popup.value.additionFields = merge(popup.value.additionFields, {
			dateFrom: dateFrom.value,
			dateTo: dateTo.value,
		});

		setTimeout(() => {
			disabled.value = false;
		}, 1000);
	}

	if (!ans) {
		store.clearPopup();
	}
}
</script>

<style scoped lang="scss">
@import "@styles/_variables.scss";

.popup-referral-promocode-date {
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
  min-width: 650px;

	&__container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
    padding: 2rem 2rem;
		position: relative;
    width: 100%;
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
		width: 100%;
		margin-bottom: 3rem;
    gap: 3rem;

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
    gap: 4rem;
	}

	&__button {
		background-color: $--c__white;
		border: 0.25rem solid $--c__light-violet;
		padding: 0.6rem 0;
		border-radius: 0.8rem;
		transition: var(--transition-03);
		cursor: pointer;
    flex: 1;

		font: {
			family: var(--f__montserrat-sb);
			size: 1.5rem;
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
    min-width: unset;

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