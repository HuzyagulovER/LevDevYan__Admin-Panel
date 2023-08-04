<template>
	<Teleport to="body">
		<Transition name="list">
			<div class="popup" v-if="popup.isActive && !popup.type">
				<div class="popup__container">
					<img src="@images/Popup.png" alt="" width="164" height="116" class="popup__image" />
					<p class="popup__text">{{ popup.text }}</p>
					<div class="popup__wrapper">
						<button class="popup__button" ref="button_true" tabindex="1" @click="confirm(true)">
							Да
						</button>
						<button class="popup__button" tabindex="1" @click="confirm(false)">
							Нет
						</button>
					</div>
					<!-- <div class="popup__close">
						<svg
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M40 4.02857L35.9714 0L20 15.9714L4.02857 0L0 4.02857L15.9714 20L0 35.9714L4.02857 40L20 24.0286L35.9714 40L40 35.9714L24.0286 20L40 4.02857Z"
							/>
						</svg>
					</div> -->
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { inject } from "@vue/runtime-core";
import { StoreGeneric, storeToRefs } from "pinia";

const store = <StoreGeneric>inject("Store");
const { popup } = storeToRefs(store);

let disabled: Ref<boolean> = ref(false);
const button_true: Ref<null> = ref(null);

function confirm(ans: boolean) {
	if (!disabled.value) {
		disabled.value = true;
		popup.value.answer = ans;
		popup.value.isReturned = true;
		popup.value.isActive = false;
		setTimeout(() => {
			store.clearPopup();
			disabled.value = false;
		}, 500);
	}
}
</script>

<style scoped lang="scss">
@import "@/style.scss";

.popup {
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
		padding: 2rem 10rem;
		position: relative;
	}

	&__image {
		width: 12rem;
		height: auto;
		margin-bottom: 3rem;
	}

	&__text {
		margin-bottom: 3rem;
		text-align: center;

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
	}
}
</style>